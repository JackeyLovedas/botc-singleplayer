# Phase 3 Slice 2B4: First Night Task Plan and ScheduledTask Skeleton Status

## 1. Scope

- Repository: `JackeyLovedas/botc-singleplayer`
- Base merge: PR #5 merged into `main` at `674c5f255d16142faa06893f54afcd053fa937d8`
- Accepted Slice 2B3 tag: `phase-3-slice-2b3-first-night-own-character-knowledge`
- Branch: `phase-3/first-night-task-plan`

This slice creates the first-night scheduled task plan from real setup, roster, assignment, first-night initialization, own-character private knowledge, and an injected first-night task catalog snapshot.

This slice does not execute night tasks, role abilities, AI decisions, minion information, demon information, nomination, voting, execution, death, victory, UI, Electron, or SQLite adapters.

## 2. Task Catalog

New package:

```text
packages/task-engine
```

Dependency boundary:

```text
task-engine -> domain-core
```

The task engine does not import `rules-snv`, `application`, projections, UI, AI, Electron, or SQLite.

The Sects & Violets rules package now exports the supported first-night task catalog:

```text
taskCatalogVersion = snv-first-night-task-catalog-v1
taskCatalogSignatureAlgorithm = canonical-first-night-task-catalog-v1
taskCatalogSignature = canonical-first-night-task-catalog-v1:20514c1a
```

The catalog contains exactly eleven task definitions:

```text
100  PHILOSOPHER_ACTION
200  MINION_INFO
300  DEMON_INFO
400  SNAKE_CHARMER_ACTION
500  EVIL_TWIN_SETUP
600  WITCH_ACTION
700  CERENOVUS_ACTION
800  CLOCKMAKER_INFORMATION
900  DREAMER_ACTION
1000 SEAMSTRESS_ACTION
1100 MATHEMATICIAN_INFORMATION
```

Pit-Hag and demon roles do not receive first-night base role tasks in this slice.

## 3. ScheduledTask Model

New domain types include:

```text
ScheduledTaskId
ScheduledTaskStatus
ScheduledTaskClass
FirstNightTaskType
FirstNightTaskOrderKey
ScheduledTaskSource
ScheduledTaskSettlementPolicy
ScheduledTask
FirstNightTaskPlan
FirstNightTaskCatalogSnapshot
FirstNightTaskDefinition
```

Current task status is closed to:

```text
PENDING
```

`FirstNightTaskOrderKey` is:

```text
baseOrder -> insertionOrder -> taskId ASCII
```

Base plan tasks use `insertionOrder = 0`. Future dynamic insertions can use the same `baseOrder` with a positive `insertionOrder`; this slice does not create dynamic tasks.

Task ids are deterministic:

```text
first-night-v1:MINION_INFO:system
first-night-v1:DEMON_INFO:system
first-night-v1:<TASK_TYPE>:seat-<two digits>
```

No UUID, clock, random value, object enumeration order, locale collation, or array index is used to identify or order tasks.

## 4. Source and Settlement Boundary

Role task sources contain exactly:

```text
kind
playerId
seatNumber
role
```

The role snapshot must match the assignment and setup role catalog snapshot.

System task sources contain exactly:

```text
kind
systemTaskType
```

System task sources do not contain player ids, seat numbers, role snapshots, recipient lists, demon identity, minion identities, or demon bluffs.

Settlement policies:

```text
ROLE tasks: REEVALUATE_SOURCE_AT_SETTLEMENT
MINION_INFO / DEMON_INFO: RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT
```

`MINION_INFO` and `DEMON_INFO` do not freeze recipients or current evil-team identities in the task plan.

## 5. Planner

`FirstNightTaskPlanner` is constructed with a `FirstNightTaskCatalogSnapshot`. Each planning call also receives the catalog snapshot in its input, and the planner requires the input snapshot to match the injected snapshot.

Planner input contains:

```text
nightNumber
setup
roster
assignment
firstNight
initialPrivateKnowledge
taskCatalogSnapshot
```

Planner output is either a canonical `FirstNightTaskPlan` or a deterministic failure. The planner validates source facts, catalog shape, catalog signature, generated task ids, task source facts, and canonical ordering before returning success.

The golden `golden-seed` assignment produces six pending tasks:

```text
PHILOSOPHER_ACTION seat-05
MINION_INFO system
DEMON_INFO system
EVIL_TWIN_SETUP seat-02
WITCH_ACTION seat-08
DREAMER_ACTION seat-12
```

## 6. Application Command

New command:

```text
PlanFirstNightTasks
```

Payload shape:

```text
{ commandType: "PlanFirstNightTasks" }
```

Allowed actors:

```text
System
Storyteller
```

Human and AI actors are rejected.

Preconditions:

- phase is `FIRST_NIGHT`;
- `nightNumber = 1`;
- `dayNumber = 0`;
- setup exists;
- roster exists;
- character assignment exists;
- first night is initialized;
- initial own-character private knowledge exists;
- no first-night task plan exists.

### Task Planning Has No User-Supplied Domain Input

`PlanFirstNightTasks` carries no user-supplied task, role, ordering, or catalog parameter:

```text
{ commandType: "PlanFirstNightTasks" }
```

Actor, phase, version, setup, roster, assignment, first-night initialization, own-character knowledge, and duplicate-plan preconditions are validated before planner invocation.

Those deterministic command-state failures remain persisted rejected receipts. Planner, catalog, generated-plan, and prospective validation failures are internal execution failures because the task plan is built entirely by application and planner code.

### Planner Failure Is Retryable

Missing planner, missing catalog, thrown planner errors, and planner failure results are retryable runtime failures with:

```text
failureStage = first-night-task-planning
```

They write no receipt and append no domain event.

Planner structured failure values remain available only as internal diagnostics. They are not command receipt content.

Planner failure classification:

```text
InvalidTaskCatalog -> failed ApplicationNotConfigured
InvalidFirstNightState -> failed DependencyExecutionFailed
InvalidTaskPlan -> failed DependencyExecutionFailed
```

The failed message preserves the planner `failureCode`, original failure message, `conflictingTaskIds`, and `conflictingRoleIds`.

### Invalid Catalog Is Application Misconfiguration

The application validates `dependencies.firstNightTaskCatalogSnapshot` before calling the planner.

Invalid or mismatched task catalogs return:

```text
status = failed
code = ApplicationNotConfigured
failureStage = first-night-task-planning
retryable = true
```

Invalid catalogs do not call the planner, do not write accepted or rejected receipts, and do not append domain events.

The application still passes a defensive copy of the validated catalog snapshot to the planner.

### Generated Plan Prospective Failure Is Retryable

For `PlanFirstNightTasks`, prospective validation `DomainError` means the internally generated event or task plan is invalid.

It returns:

```text
status = failed
code = DependencyExecutionFailed
failureStage = prospective-validation
retryable = true
```

It does not save a `DomainValidationFailed` rejected receipt. Fixing the planner or application allows the same `commandId` to retry successfully.

### No Planning Failure Command Receipts

No planner failure, invalid task catalog, thrown planner error, or generated-plan prospective failure is stored as a command receipt.

Persisted command rejections remain only for deterministic command-state failures, including actor, phase, version, missing prerequisite facts, and duplicate task-plan facts.

## 7. Domain Event

New domain event:

```text
FirstNightTaskPlanCreated
```

`PlanFirstNightTasks` emits exactly one domain event. It does not emit `PhaseTransitioned`.

The canonical state adds:

```text
firstNightTaskPlan
```

The phase remains:

```text
phase = FIRST_NIGHT
nightNumber = 1
dayNumber = 0
```

The state does not add `currentTask`, `activeTask`, task results, visible task options, or delivered evil-team information.

Replay rejects malformed task plans, duplicate task ids, wrong ordering, missing system tasks, duplicate system tasks, role source mismatches, non-`PENDING` statuses, nonzero base insertion orders, extra hidden system-source fields, and task plans before initial private knowledge.

## 8. Projection Boundary

Player and AI private knowledge projections still expose only established private knowledge.

They do not expose:

- `firstNightTaskPlan`;
- task ids;
- task types;
- task sources;
- source player ids;
- source role snapshots;
- pending role task lists;
- `MINION_INFO`;
- `DEMON_INFO`;
- role task names.

## 9. CI

The Windows CI job now includes focused setup, assignment, information, projection, and task-engine tests.

Ubuntu CI remains the full gate for:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

## 10. Tests

Covered areas:

- first-night task catalog count, order, signature, and mutation sensitivity.
- task-engine dependency boundary.
- injected catalog and input catalog validation.
- golden first-night task plan.
- deterministic task ids and ordering.
- system tasks without frozen recipients.
- role task source validation against roster, assignment, and catalog facts.
- replay validation for `FirstNightTaskPlanCreated`.
- application command preconditions and actor rules.
- retryable runtime planning failures.
- invalid catalog retry without planner invocation.
- planner failure retry without command receipts.
- generated-plan prospective failure retry without `DomainValidationFailed` receipts.
- deterministic actor, phase, version, and duplicate-plan rejection receipts.
- projection leakage after task plan creation.
- Windows CI focused task coverage.

Local gates run during implementation:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 412 tests
pnpm test:coverage: passed, 412 tests
```

## 11. Not Implemented

- task execution.
- active/current task state.
- task input schemas.
- visible task options.
- role ability settlement.
- `MINION_INFO` settlement.
- `DEMON_INFO` settlement.
- evil-team information delivery.
- dynamic Philosopher insertion.
- AI decisions.
- UI.
- Electron.
- SQLite.

## 12. BLOCKER Status

No implementation-level Slice 2B4 blocker is known after local typecheck, lint, test, and coverage.

CI status is not claimed here until the PR checks complete.

## 13. Next Step

Recommended next slice after this PR is reviewed and merged:

```text
Phase 3 Slice 2B5: MINION_INFO and DEMON_INFO Ordered Settlement
```

Do not start Slice 2B5 from this PR.
