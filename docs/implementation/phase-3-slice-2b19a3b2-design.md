# Phase 3 Slice 2B19A3B2 Design Round 1: Combined Native and Philosopher-Gained Dreamer Mathematician Integration

## Metadata

- Slice ID: `2B19A3B2`
- Authorization: `USER_AUTHORIZED_2B19A3B2_COMBINED_DREAMER_MATHEMATICIAN_INTEGRATION`
- Design round: `1 / 2`
- Candidate base: `c0c0cdfef1c1aa4cebb841f9867007a319701459`
- Branch: `phase-3/combined-dreamer-mathematician-integration`
- Governance precheck: `docs/architecture/2B19A3B2-go-no-go-under-governance-v1.md`, verdict `GO`
- Rule evidence: `docs/rules/evidence/2B19A3B2.md`
- Rule evidence SHA-256: `64607c71c5d9b947b78063cdc8e914f684b975748cb2c183fe2e4119b4036eb0`
- Rule verdict: `RULE_READY`
- Rule conflict list: `[]`
- Coverage target: `PARTIAL / COMBINED_NATIVE_AND_GAINED_DREAMER_FIRST_NIGHT_COUNT_ONLY`
- Mathematician role after acceptance: `PARTIAL`
- Dreamer role after acceptance: `PARTIAL`
- Philosopher role after acceptance: `PARTIAL`
- Vortox standalone role after acceptance: `NOT_STARTED`
- Primary risk: `FORMAL_MATHEMATICIAN_DISTINCT_PLAYER_AGGREGATION_ACROSS_NATIVE_AND_GAINED_DREAMER`
- Production semantics changed: `false`
- BOTC rule semantics changed: `false`
- Dreamer V1-V6 changed: `false`
- Mathematician public payload/schema changed: `false`
- New event/state/evidence/override/task order: `none`
- Predicted production files: `0`
- Predicted added production LOC: `0`
- Implementation authorization at design time: `false`; only an independent `RULE_DESIGN_PASS` may change it.

## Parent dependencies

This design depends on the accepted implementation and final review of:

- 2B19T role-tenure foundation;
- 2B18A first-night ability-outcome ledger;
- 2B18B formal Mathematician first-night resolution;
- 2B19A3A base Dreamer effective-current-Vortox behavior;
- 2B19A3B1 native/base Dreamer V4 with exact canonical Philosopher-produced DRUNK;
- 2B19B Philosopher-gained Dreamer V4/V5/V6 execution and the real Seamstress continuation to the unsettled Mathematician boundary;
- Engineering Governance Traceability V1.1;
- Vitest multi-slice ownership registry and the accepted 9 ordinary / 10 coverage topology.

These are immutable accepted authorities. No implementation may alter their public or persisted contracts.

## Governance

The governance precheck proves all 13 GO conditions. This is a bounded test-and-acceptance integration Slice. The only new semantic authority is a real command-stream proof that the already-accepted base Mathematician formally consumes both accepted Dreamer facts together. Tests may call existing internal pure seams only to prove classification and ordering; a pure fixture never substitutes for the formal R1 stream.

The frozen definition of done includes all reachability/trust classifications, behavior/API/schema/failure/replay/projection contracts, file allowlists, size estimate, criterion rows, coverage labels and stop conditions below.

## Rule evidence and claims

The Slice implements only these sourced claims:

1. Mathematician counts players whose abilities worked abnormally due to another character, not facts.
2. Same-player qualifying facts count once; all facts remain supporting evidence.
3. Native Dreamer and the Philosopher are different players and therefore count separately.
4. Accepted native V4 and gained V6 Vortox facts are qualifying abnormal results.
5. The current Mathematician source/ability is excluded from its own resolution.
6. The count window is the approved exclusive initialization boundary through the inclusive pre-resolution boundary.
7. Effective Vortox requires the delivered Mathematician number to be false but does not change the true count.

No other role or interaction claim is implemented.

## Scope

The sole positive scope is one fixed first-night, fixed 12-player R1 path:

- effective Philosopher chooses Dreamer;
- canonical native Dreamer DRUNK is created;
- effective current Vortox applies;
- native V4 and Philosopher-gained V6 settle through real commands;
- every real intervening task settles;
- base Mathematician settles through `SettleMathematicianInformation`;
- the formal payload, derived ledger fact, task progress, accepted replay, receipt, projection and failure boundaries are verified.

The test data must contain no third qualifying player.

## Accepted bridge

The primary authority must build the following stream exclusively by real `GameApplicationService.execute` calls and the configured command store:

1. create game;
2. select Sects & Violets script;
3. generate exact legal roster containing native Dreamer `P1`, Philosopher `P2`, effective Vortox `D`, and base Mathematician `M`;
4. create roster and assign characters;
5. initialize first night and plan tasks;
6. settle every real predecessor in plan order;
7. open the Philosopher opportunity and submit `CHOOSE_GOOD_CHARACTER(dreamer)`;
8. assert the canonical grant, V2 insertion and Philosopher-produced DRUNK targeting `P1`;
9. settle every real task to the base Dreamer position;
10. open base Dreamer V3 and submit a legal target;
11. assert the accepted three-event native batch and V4 delivery/fact;
12. open Philosopher-gained Dreamer V4 and submit a legal target;
13. assert the accepted three-event gained batch and V6 delivery/fact;
14. settle the next real Seamstress task by its formal action command (`DEFER` is the frozen deterministic choice);
15. assert the next unsettled task is the base `MATHEMATICIAN_INFORMATION` task;
16. execute `SettleMathematicianInformation` as the system actor;
17. load the complete accepted stream, rebuild state and build accepted-stream projections.

Forbidden construction methods: handwritten `GameState`, handwritten ledger, direct event append, direct terminal-fact append, mutation of accepted events, fake task progress, skipped tasks, direct event-applier calls as R1 authority, or a fabricated Mathematician delivery.

## Frozen scenario identities

The integration test must bind and compare identities obtained from the accepted stream; it must not hard-code repository-specific player IDs:

```text
P1 = native/base Dreamer source player
P2 = Philosopher and gained-Dreamer source player
D  = current effective Vortox player
M  = base Mathematician source player
P1 != P2 != M
```

The two Dreamer facts must have:

```text
nativeFact.sourcePlayerId = P1
nativeFact.abilityInstance.kind = BASE_ROLE_TASK
nativeFact.abilityInstance.abilityInstanceId =
  first-night-ability-instance-v1:base-task:<native Dreamer taskId>

gainedFact.sourcePlayerId = P2
gainedFact.abilityInstance.kind = PHILOSOPHER_GAINED_TASK_V2
gainedFact.abilityInstance.abilityInstanceId =
  first-night-ability-instance-v1:philosopher-gained-v2:<gained Dreamer taskId>:grant:<grantId>

nativeFact.sourcePlayerId != gainedFact.sourcePlayerId
nativeFact.abilityInstance.abilityInstanceId != gainedFact.abilityInstance.abilityInstanceId
nativeFact.auditFactId != gainedFact.auditFactId
```

Each fact ID must equal `first-night-ability-outcome-fact-v1:<sourceEventId>`.

## Window

The existing `FirstNightMathematicianCountWindow` is frozen without version change:

```text
windowVersion = first-night-ability-outcome-window-v1
gameId = current game
nightNumber = 1
rulesBaselineVersion = current accepted baseline
firstNightInitializedEventId = accepted FirstNightInitialized eventId
startEventSequence = FirstNightInitialized.eventSequence
startBoundary = EXCLUSIVE
endEventSequence = last accepted eventSequence before Mathematician delivery
endBoundary = INCLUSIVE
```

The delivery must satisfy:

```text
deliveryEventSequence = endEventSequence + 1
nativeFact.sourceEventSequence > startEventSequence
nativeFact.sourceEventSequence <= endEventSequence
gainedFact.sourceEventSequence > startEventSequence
gainedFact.sourceEventSequence <= endEventSequence
```

Facts at or before `startEventSequence`, after `endEventSequence`, after delivery, or from another night do not qualify. The current Mathematician delivery/fact is outside its own window.

## Fact qualification

A fact qualifies only if all are true:

- exact `FirstNightAbilityOutcomeFact` shape and accepted-history provenance validate;
- `sourceEventSequence` falls in the frozen window;
- `outcomeStatus === "ABNORMAL"`;
- `causedByAnotherCharacterAbility === true`;
- source player is not resolving `M`;
- ability instance is not the resolving Mathematician instance.

The two Dreamer facts must both be:

```text
outcomeStatus = ABNORMAL
causeKind = VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility = true
```

The native fact additionally retains the accepted exact Philosopher DRUNK evidence. No duplicate terminal fact is created by either settlement.

Classification precedence is frozen: own-instance exclusion, resolving-source exclusion, NORMAL ignored, PENDING_TRIGGER ignored, qualifying ABNORMAL, then UNRESOLVED as redundant when the same player already has qualifying evidence or blocking otherwise. No fact is silently dropped.

## Distinct-player aggregation

The accepted algorithm is frozen exactly as follows:

1. consume every validated ledger fact inside the canonical pre-delivery state;
2. classify it using the precedence above;
3. group qualifying facts by exact `sourcePlayerId`;
4. require all facts in one player group to agree on the canonical source seat through their validated provenance;
5. emit at most one `MathematicianAbnormalPlayer` per source player;
6. include every unique qualifying fact ID for that player in `supportingFactIds`;
7. sort each `supportingFactIds` by stable UTF-16 code-unit comparison;
8. sort abnormal-player rows by ascending seat number, then player ID by code unit;
9. set `qualifyingAbnormalFactIds` to the unique code-unit-sorted union of all supporting IDs;
10. set `trueCount=distinctAbnormalPlayers.length` and require it in `0..11`.

Deduplication must not use fact ID, ability role, ability instance, cause kind, evidence count, Dreamer returned roles or alignment. A same-player second fact expands support but never adds a player. Two different players sharing Dreamer semantics remain two rows.

For the frozen R1 stream, and only because no third player qualifies:

```text
distinctAbnormalPlayers = [row(P1), row(P2)] in seat/player canonical order
trueCount = 2
```

Production and tests must prove the resolver also derives zero, one and same-player-multiple-fact results; no branch or constant may encode `2` as a general result.

## True count and Vortox selected count

The frozen scenario has an effective base Mathematician and one effective current Vortox. Existing policy yields:

```text
trueCount = 2
numberDomainVersion = mathematician-fixed-12-number-domain-v1
candidateDomain = [0,1,2,3,4,5,6,7,8,9,10,11]
legalCandidateCounts = [0,1,3,4,5,6,7,8,9,10,11]
selectedCount = 0
simulationPolicyVersion = mathematician-smallest-false-policy-v1
informationReliability = VORTOX_CONSTRAINED_FALSE
vortoxConstraint.kind = VORTOX_FALSE_REQUIRED
```

The rule-level label `VORTOX_FALSE` is represented by the accepted public literal `VORTOX_CONSTRAINED_FALSE`; no rename is permitted. `selectedCount` changes neither `trueCount` nor fact classification. In the no-current-Vortox control with an effective Mathematician:

```text
selectedCount = trueCount
informationReliability = RULE_CORRECT
vortoxConstraint.kind = NONE_NO_CURRENT_VORTOX
```

Impaired Mathematician and impaired/dead/unprovable Vortox keep their existing fail-closed/represented policy and are not new success paths.

## Source contract

The formal settlement must resolve the existing base source contract from accepted state:

```text
sourceContract.kind = BASE_MATHEMATICIAN
sourceContract.taskPlanVersion = first-night-task-plan-v2
sourceContract.taskId = base Mathematician taskId
sourceContract.sourcePlayerId = M
sourceContract.sourceSeatNumber = M seat
sourceContract.sourceRole.roleId = mathematician
sourceContract.sourceRoleAtSettlement.roleId = mathematician
sourceContract.sourceRoleTenure.roleId = mathematician
sourceContract.sourceRoleTenure.playerId = M
sourceContract.sourceRoleTenure is active at settlementCharacterStateRevision
sourceContract.abilityInstance.kind = BASE_ROLE_TASK
sourceContract.abilityInstance.abilityRoleId = mathematician
sourceContract.abilityInstance.taskId = sourceContract.taskId
sourceContract.abilityInstance.sourcePlayerId = M
```

No caller-supplied source, state, tenure, window, fact list or count is accepted.

## Ability instance

The resolving ID is exactly:

```text
resolvingAbilityInstanceId =
  first-night-ability-instance-v1:base-task:<base Mathematician taskId>
```

and equals `sourceContract.abilityInstance.abilityInstanceId`. Facts with that instance go to `excludedOwnAbilityFactIds`; other facts from `M` go to `excludedResolvingSourceFactIds`. Neither enters `trueCount`. This does not blanket-exclude facts merely because `abilityRoleId=mathematician`.

## Public delivery payload freeze

No field or literal changes are allowed. The existing exact payload remains the sole carrier with these keys:

```text
rulesBaselineVersion, nightNumber, taskId, taskType, deliveryId,
deliveryEventSequence, sourceContract, resolutionModelVersion,
windowSnapshot, ledgerVersion, auditModelVersion,
resolvingAbilityInstanceId, qualifyingAbnormalFactIds,
distinctAbnormalPlayers, excludedResolvingSourceFactIds,
excludedOwnAbilityFactIds, ignoredNormalFactIds,
ignoredPendingFactIds, redundantUnresolvedFactIds, trueCount,
numberDomainVersion, candidateDomain, legalCandidateCounts,
selectedCount, sourceEffectiveness, vortoxConstraint,
simulationPolicyVersion, informationReliability,
knowledgeModelVersion, knowledgeStage,
settlementCharacterStateRevision
```

Required fixed literals include `taskType=MATHEMATICIAN_INFORMATION`, `resolutionModelVersion=mathematician-first-night-count-resolution-v1`, `ledgerVersion=first-night-ability-outcome-ledger-v1`, `auditModelVersion=first-night-ability-outcome-audit-v1`, `knowledgeModelVersion=mathematician-knowledge-v1`, and `knowledgeStage=MATHEMATICIAN_INFORMATION`.

## Batch

A successful formal Mathematician command creates exactly two persisted events in this order:

1. `MathematicianInformationDelivered`;
2. `ScheduledTaskSettled` with `taskType=MATHEMATICIAN_INFORMATION` and `outcomeType=MATHEMATICIAN_INFORMATION_DELIVERED`.

They must have one command ID, batch ID, correlation/causation chain, timestamp, rules baseline, and game version; distinct event IDs; consecutive event sequences; and the settlement revision must equal delivery `settlementCharacterStateRevision`. The batch increments game version exactly once. The task changes from pending to settled. Phase remains `FIRST_NIGHT`; no `PhaseTransitioned` is emitted.

The event applier derives one `FirstNightAbilityOutcomeFact` from the delivery. That fact is state derived from the accepted event, not a third persisted event. Repeating the accepted command is idempotent and produces no duplicate delivery, settlement or fact.

Naked delivery, settlement-before-delivery, missing suffix, duplicate event, cross-command, cross-batch, wrong task/source/window/count/classification and non-consecutive sequence are invalid.

## Replay proof

Before construction and append, the application must use the existing accepted-stream resolver to:

1. capture the complete prior accepted prefix;
2. validate its event stream and batch semantics;
3. rebuild canonical state;
4. reconstruct initialization boundary, task plan/progress, source tenure and ability instance;
5. reconstruct and validate the complete ledger and its fact provenance;
6. calculate the window and classification sets;
7. aggregate distinct players and true count;
8. resolve current source effectiveness and Vortox constraint;
9. calculate legal candidates and selected count;
10. construct the expected delivery and settlement;
11. compare the generated pair exactly with that canonical decision;
12. validate the prospective two-event batch and complete prospective stream;
13. rebuild prospective state and compare canonical fingerprints;
14. only then commit atomically.

Payload self-claims, latest-state recomputation of historical delivery, caller-supplied ledgers/windows/facts and state-only projection cannot supply provenance.

## Ledger

The accepted prefix already derives one exact native V4 fact and one exact gained V6 fact. Formal Math settlement consumes them. Applying `MathematicianInformationDelivered` derives one Math fact with its accepted `MATHEMATICIAN_DELIVERY` evidence and source tenure. The current Math fact is outside its own window and can never feed back into the delivery being validated.

The post-command ledger must contain exactly one additional Math fact, and replay must deterministically reproduce the same ledger. `ScheduledTaskSettled` creates no second fact. Duplicate source event/fact ID, duplicate evidence reference, wrong evidence cardinality or cross-linked evidence fails closed.

## Projection

Only the accepted-event-stream player/AI builders may project the Mathematician result. The Mathematician source player and its AI receive exactly:

```ts
{ count: selectedCount }
```

No other player receives a Mathematician entry. The projection must not expose `trueCount`, abnormal players, supporting IDs, Dreamer/Philosopher/Vortox identities, native/gained distinction, ledger causes, impairment, source contract, ability instances, window, reliability or candidate sets. Repeated projection is stable and caller mutation cannot mutate stored state. Historical projection uses the accepted stored delivery and does not recompute from a later ledger or character state.

## Receipts and failures

Deterministic command errors use existing rejected-result/receipt semantics. Retryable dependency failures remain receipt-free and preserve the identical command ID for retry. On every retryable failure:

```text
status = failed
retryable = true
accepted events added = 0
accepted receipt added = 0
gameVersion unchanged
task remains pending
same commandId may be retried
```

On success, one accepted receipt covers the one two-event batch. A second identical command returns the accepted idempotent result without writing events or a fact.

## Failure matrix

| Failure | Reachability / trust | Frozen result |
|---|---|---|
| unauthorized actor | R1/T1 | deterministic rejected result; zero accepted events |
| malformed command, missing/extra/wrong literal | R1/T1 | fail closed before canonical resolution |
| stale expected version | R1/T1 | deterministic version rejection; no events |
| wrong task / task not next / already settled | R1/T1 | deterministic rejection; no events |
| invalid source/tenure/ability instance | R1/T1→T2 | deterministic rejection or receipt-free canonical failure under existing code |
| missing/malformed/duplicate ledger fact | R3/T1 | rebuild/resolution rejects; no new events |
| unresolved nonredundant fact | R1/T2 | receipt-free `DependencyExecutionFailed`; task pending |
| invalid/missing window boundary | R3/T1 | replay/resolution rejects |
| count overflow / no legal candidate | R3/T2 or R4/T3 | fail closed; no invented result |
| wrong true/selected/classification arrays | R3/T1 | exact replay/prospective validation rejects |
| metadata generation fault | R1/T1 | `MetadataGenerationFailed`, stage `event-metadata`, receipt-free |
| prospective validation fault | R1/T1 | `DependencyExecutionFailed`, stage `prospective-validation`, receipt-free |
| event load/rebuild fault | R1/T1 | existing read/rebuild failure code/stage, receipt-free |
| append/before-commit/during-commit fault | R1/T1 | `EventStoreAppendFailed`, stage `accepted-commit`, atomic rollback |
| accepted receipt write fault | R1/T1 | atomic rollback, no accepted events or receipt |
| receipt read fault | R1/T1 | read failure, no mutation |
| receipt replay after success | R1/T1 | idempotent accepted result, no duplicate write |

The implementation must assert actual existing codes/stages from the formal port paths; it must not change them to satisfy this table.

## Legacy compatibility

- Valid accepted Mathematician base, V1 and V2 histories retain their existing payloads and replay meaning.
- Accepted Option A continues to reject unsupported legacy V1 base-plus-gained ordering without migration.
- Dreamer V1-V6 accepted histories remain unchanged.
- 2B19A3A, 2B19A3B1 and 2B19B ownership/traceability contracts and marker inventories must remain exact.
- No persisted history is rewritten, normalized, backfilled or reinterpreted.

## Reachability

### R1

- successful complete Philosopher→native V4→gained V6→Seamstress→base Math accepted stream;
- formal Math rejection paths;
- real dependency/metadata/prospective/commit/receipt faults;
- accepted-stream player and AI projection.

### R2

- existing valid legacy Math and Dreamer histories with exact replay promise.

### R3

- manually mutated persisted/imported events, deliveries, facts, provenance, windows, classifications and batches;
- malformed/hostile T1 objects.

### R4

- source-impaired gained Dreamer, POISONED Dreamer, No Dashii, impaired/dead Vortox fallback, third abnormal player, more than two Dreamer sources, new gained Math, other-night, general lifecycle, first-night completion, day and Phase 2C.

## Trust

### T1

Formal commands, event envelopes, persisted streams, delivery/fact/settlement payloads, viewer identity and storage/receipt ports retain exact runtime shape, dense-array, no-accessor/no-symbol/no-cycle/plain-object, canonical-ID, extra/missing-field, replay and provenance gates.

### T2

Validated rebuilt state, task plan/progress, tenure, impairment, ledger, count window and canonical Math resolution must preserve cross-links, deterministic reconstruction and reference isolation.

### T3

Pure fact classification, player grouping, code-unit sorting and candidate selection are closed deterministic seams. T3 does not become an external hostile boundary.

## Ownership contract

All new application tests use marker prefix:

```text
[2B19A3B2-
```

They live in `packages/application/src/game-application-service.test.ts` inside a new `describeApplicationServiceShard("information-and-later-actions", ...)` block. Therefore their sole owner is:

```text
application-service-information-and-later-actions
```

The active ownership registry entry is created only after marker tests and implementation traceability exist. It freezes:

- `contractId: 2B19A3B2`;
- marker regex `^\[2B19A3B2-[^\]]+\]`;
- application test file above;
- owner project above;
- traceability file `docs/implementation/phase-3-slice-2b19a3b2-test-traceability.md`;
- exact criterion IDs `C01-C46` and `S01-S12`;
- supporting prefix `SUP-2B19A3B2-`;
- frozen post-implementation inventory hashes/counts produced by the existing verifier;
- status `ACTIVE` only when every row resolves.

No new Vitest project, ordinary group or coverage group is allowed. A3A, A3B1 and 2B19B exact contracts must continue to pass. Cross-contract marker references and unknown markers must reject.

## Coverage profile

After the product/test/traceability/ownership commit, run three complete 10-process coverage candidates. All three must have identical test inventory, group inventory, source inventory, zero-hit statement/function/line/branch-arm sets and hashes, with no timeout, `onTaskUpdate`, unhandled error or exit 1.

A profile-only child commit may add one exact profile and select it in the existing workflow. Its `sourceHead` must be the product/test commit (or final permitted product repair commit), never the profile commit. The profile is a full candidate, not a subset and not auto-learned. It must preserve thresholds and 9/10 topology.

## Production allowlist

Empty. No file under `packages/**/src/*.ts` may change except the explicitly allowed test file. If a production change is discovered, stop and return `RESLICE_REQUIRED`.

## Size estimate

| Metric | Estimate | Suggested limit | Forced limit | Result |
|---|---:|---:|---:|---|
| changed production files | 0 | 4 | 7 | PASS |
| added production LOC | 0 | 600 | 1000 | PASS |
| independent product risks | 1 | 1 | reslice at 3 subsystems | PASS |
| new public trust boundaries | 0 | 0 | none permitted | PASS |

## Stop-Loss

Immediate `RESLICE_REQUIRED` on any production change, new event/state/evidence/payload version/task order/override/generic ledger/multi-night abstraction, Dreamer V4/V6 modification, workflow topology/timeout/dependency/threshold change, or expansion beyond the file and criterion allowlists.

## Design-time traceability C01-C24

Each row freezes the nine Governance V1.1 fields. Physical test titles and final support IDs are implementation-time bindings, not design authority.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | Philosopher gains Dreamer | Real first-night command chooses Dreamer and persists grant/insertion | full formal command prefix | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | accepted canonical V2 chain | planned accepted bridge |
| C02 | In-play native becomes drunk | Accepted choice creates exact Philosopher duplicate DRUNK on P1 | accepted stream and rebuilt impairment | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | exact canonical DRUNK before V4 | planned accepted bridge |
| C03 | Native V4 is abnormal under Vortox | Real base Dreamer command settles V4 and derives one qualifying fact | accepted target/delivery/settlement stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | one V4 ABNORMAL Vortox fact | planned accepted bridge |
| C04 | Gained V6 is abnormal under Vortox | Real gained Dreamer command settles V6 and derives one qualifying fact | accepted target/delivery/settlement stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | one V6 ABNORMAL Vortox fact | planned accepted bridge |
| C05 | Both are terminal facts | Rebuilt ledger contains exactly the V4 and V6 source facts before Math | accepted pre-Math ledger reconstruction | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | two exact Dreamer facts | planned accepted bridge |
| C06 | Contributors are players | V4 source is P1 and V6 source is P2, with P1 != P2 | accepted ledger identity assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | two distinct sourcePlayerIds | planned accepted bridge |
| C07 | Ability identities remain distinct | V4 base instance differs from V6 gained V2 instance | accepted provenance assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | two distinct canonical instance IDs | planned accepted bridge |
| C08 | Both facts are in window | Both source sequences are after exclusive start and at/before inclusive end | formal Math delivery/window plus fact sequences | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | both inside exact window | planned accepted bridge |
| C09 | Both facts qualify | Delivered classification lists both fact IDs as qualifying | formal Math payload and canonical re-resolution | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | both qualify | planned accepted bridge |
| C10 | No third player contributes | Frozen stream has no other qualifying source player | complete ledger classification assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | exactly P1 and P2 | planned accepted bridge |
| C11 | Count unit is player | `distinctAbnormalPlayers.length` is two | formal payload assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | length 2 | planned accepted bridge |
| C12 | True count is dynamic | Formal delivery trueCount equals derived distinct length, with zero/one controls | R1 stream plus pure policy controls | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | frozen stream 2, no hard-code | accepted bridge; pure controls supporting only |
| C13 | Supporting fact set is exact | Each player row contains exactly all its qualifying fact IDs | formal payload/ledger exact comparison | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | exact complete IDs | planned accepted bridge |
| C14 | Canonical order is deterministic | player rows sort seat/player; fact IDs sort code unit | pure permutation seam | R1 | T3 | PURE_POLICY_SEAM | identical canonical order | planned validated fact set |
| C15 | Same player counts once | Multiple qualifying facts for one source yield one row and trueCount one | pure resolver with validated facts | R1 | T3 | PURE_POLICY_SEAM | deduplicated player | planned validated fact set |
| C16 | Same-player support is complete | The deduped row retains every unique qualifying ID | pure resolver with multi-fact player | R1 | T3 | PURE_POLICY_SEAM | all supporting IDs retained | planned validated fact set |
| C17 | Normal does not count | NORMAL fact enters ignoredNormalFactIds | pure classifier | R1 | T3 | PURE_POLICY_SEAM | ignored, count unchanged | planned validated fact set |
| C18 | Pending does not count | PENDING_TRIGGER enters ignoredPendingFactIds | pure classifier | R1 | T3 | PURE_POLICY_SEAM | ignored, count unchanged | planned validated fact set |
| C19 | Math excludes itself | resolving instance/source facts enter exact exclusion arrays | formal payload plus pure controls | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | own current result excluded | planned accepted bridge |
| C20 | Outside-window facts do not count | before-start/after-end/wrong-night clones fail replay or classification | hostile persisted clone through rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | rejected or excluded by exact window | planned hostile clone |
| C21 | Invalid facts fail closed | duplicate/malformed/unprovenanced facts reject the stored stream | hostile persisted clone through rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | DomainError/fail closed | planned hostile clone |
| C22 | Math formally delivers | Real SettleMathematicianInformation appends delivery | formal command success | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | one exact delivery | planned accepted bridge |
| C23 | Math formally settles task | Same success appends linked settlement and task is settled | formal command success/rebuild | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | pending→settled | planned accepted bridge |
| C24 | Vortox forces false Math output | Effective Vortox leaves trueCount 2 and selects 0 | formal delivery assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | 2/0/VORTOX_CONSTRAINED_FALSE | planned accepted bridge |

## Design-time traceability C25-C46

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C25 | Vortox result is actually false | selectedCount differs from trueCount | formal payload assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | 0 != 2 | planned accepted bridge |
| C26 | No Vortox gives truth | Effective no-Vortox base Math returns selected=true | real formal no-Vortox command | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | selectedCount=trueCount/RULE_CORRECT | planned accepted control stream |
| C27 | Player sees selected count only | Source player view is exactly `{count:0}` | accepted-stream projection | R1 | T1 | PROJECTION | exact one-key view | planned accepted bridge |
| C28 | AI sees same selected count | Source AI view deep-equals player view | accepted-stream AI projection | R1 | T1 | PROJECTION | exact one-key view | planned accepted bridge |
| C29 | Non-sources see nothing | Every other player/AI omits Math information | accepted-stream projection | R1 | T1 | PROJECTION | omitted | planned accepted bridge |
| C30 | Hidden Math/Dreamer provenance never leaks | Serialized views omit true count, roles, facts, causes, reliability, window | exact projection negative matrix | R1 | T1 | PROJECTION | no secret token/field | planned accepted bridge |
| C31 | Accepted replay is stable | Complete stream rebuilds and reprojects identically | accepted event replay | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | deterministic equality | planned accepted bridge |
| C32 | Hostile replay fails | Mutated prefix/delivery/fact/settlement rejects rebuild/projection | hostile accepted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail closed | planned hostile clones |
| C33 | Payload cannot lie about trueCount | wrong trueCount rejects prospective/replay | hostile generated/persisted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | rejected | planned hostile clone |
| C34 | Payload cannot lie about selectedCount | wrong selected/legal candidates/reliability rejects | hostile generated/persisted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | rejected | planned hostile clone |
| C35 | Payload cannot lie about window | wrong anchors/boundaries/end sequence rejects | hostile persisted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | rejected | planned hostile clone |
| C36 | Payload cannot lie about classifications | missing/extra/misfiled IDs reject exact canonical comparison | hostile persisted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | rejected | planned hostile clone |
| C37 | Success is atomic | exact delivery+settlement share metadata and one version | formal command plus batch validation | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | two contiguous events, one commit | planned accepted bridge |
| C38 | Duplicate delivery is impossible | identical command replays receipt and adds no delivery | formal idempotent retry | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | one delivery | planned accepted bridge |
| C39 | Duplicate ledger fact is impossible | success adds one Math fact; retry adds none | rebuilt ledger before/after/retry | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | one derived fact | planned accepted bridge |
| C40 | Retryable faults are atomic | real read/rebuild/metadata/prospective/commit/receipt faults add nothing | formal fault-port invocation | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | failed/retryable/receipt-free/version-safe | planned real fault ports |
| C41 | Same command recovers | after one-shot fault, same command succeeds once then idempotently | formal fault-clear-retry-repeat sequence | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | one accepted batch/receipt | planned real fault port |
| C42 | Legacy meanings remain | valid Math/Dreamer versions replay without migration | existing legacy fixtures/replay | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | exact prior meaning | planned legacy authorities |
| C43 | Accepted slices do not regress | A3A/A3B1/2B19B exact focused tests and contracts pass | existing focused suites/verifier | R1 | T1 | CROSS_PLATFORM_CI | all exact PASS | accepted prior authorities |
| C44 | Ordinary topology stays complete | nine ordinary groups have zero inventory errors | exact-head merged ordinary audit | R1 | T1 | CROSS_PLATFORM_CI | 9 groups; missing/duplicate/unexpected 0 | exact-head CI |
| C45 | Coverage topology stays complete | ten coverage groups and exact profile pass | three candidates plus exact-head coverage audit | R1 | T1 | CROSS_PLATFORM_CI | 10 groups; stable hashes | exact profile/CI |
| C46 | Windows is deterministic | exact-head Windows job passes with same behavior | Windows deterministic CI | R1 | T1 | CROSS_PLATFORM_CI | PASS/no timeout/onTaskUpdate/exit1 | exact-head CI |

## Security and structural criteria S01-S12

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| S01 | Command is exact T1 data | missing/extra/wrong command fields/literals reject | direct command validator and formal entry | R3 | T1 | STRUCTURAL_VALIDATION | fail closed | canonical command seed |
| S02 | Fact IDs are unique | duplicate fact ID/evidence reference rejects stream | hostile persisted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail closed | accepted bridge clone |
| S03 | Provenance cross-links are exact | wrong source/seat/task/instance/tenure rejects | hostile persisted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail closed | accepted bridge clone |
| S04 | Window anchors are provenance-bound | missing initialization and wrong end boundary reject | hostile prefix/payload clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail closed | accepted bridge clone |
| S05 | Arrays are dense, unique and ordered | unsorted IDs, duplicate supports and malformed player rows reject | direct payload validator | R3 | T1 | STRUCTURAL_VALIDATION | fail closed | canonical delivery seed |
| S06 | Hostile objects never execute code | proxy, revoked proxy, getter, symbol, cycle, sparse/nonplain reject; getter calls 0 | direct T1 validator matrix | R3 | T1 | STRUCTURAL_VALIDATION | fail closed/zero getter calls | canonical command/delivery/fact seeds |
| S07 | Accepted provenance cannot be caller supplied | handwritten state/ledger/window/facts cannot authorize settlement | formal command on absent/forged persisted authority | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail closed | accepted prefix and hostile clone |
| S08 | Effectiveness/Vortox provenance is exact | wrong/dead/impaired/stale/conflicting source cannot enter frozen success | hostile replay plus R4 non-selection | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail closed | accepted bridge clone |
| S09 | Projection is historical and isolated | state-only path rejects; repeated accepted projection survives caller mutation | accepted projection plus caller clone mutation | R1 | T1 | PROJECTION | stable stored result | accepted bridge |
| S10 | Ownership is exclusive | 2B19A3B2 has one owner; A3A/A3B1/2B19B unchanged; unknown/cross marker rejects | ownership self-test/audit | R1 | T1 | CROSS_PLATFORM_CI | all contracts exact PASS | active ownership registry |
| S11 | Traceability is complete | all 58 rows resolve once, MechanismMatch PASS, no multi-primary identity | deterministic traceability/ownership audit | R1 | T1 | CROSS_PLATFORM_CI | complete exact mapping | implementation traceability |
| S12 | Determinism primitives remain forbidden | affected source/test audit contains no locale/clock/random/UUID canonical primitive | static source audit plus Windows CI | R1 | T3 | CROSS_PLATFORM_CI | PASS | exact-head source and CI |

## Planned supporting authorities

- `PLANNED_SUPPORTING_AUTHORITY A`: complete real accepted combined stream; expected `ACCEPTED`; mutation `NONE`; used by C01-C13, C19, C22-C25, C27-C31, C37-C39.
- `PLANNED_SUPPORTING_AUTHORITY B`: real no-Vortox formal Math control; expected `ACCEPTED`; mutation `NONE`; used by C26.
- `PLANNED_SUPPORTING_AUTHORITY C`: validated pure fact sets/permutations; expected `ACCEPTED`; mutation `CLONE_MUTATED`; used by C12, C14-C18.
- `PLANNED_SUPPORTING_AUTHORITY D`: hostile clones of the accepted bridge/pair; expected `HOSTILE`; mutation `PERSISTED_OR_IMPORTED_MUTATED`; used by C20-C21, C32-C36, S02-S04, S07-S08.
- `PLANNED_SUPPORTING_AUTHORITY E`: real one-shot application fault ports; expected `HOSTILE`; mutation `NONE` to persisted history because commit is prevented; used by C40-C41.
- `PLANNED_SUPPORTING_AUTHORITY F`: accepted legacy Math/Dreamer fixtures; expected `LEGACY`; mutation `NONE`; used by C42.
- `PLANNED_SUPPORTING_AUTHORITY G`: projection/caller-clone authority; expected `ACCEPTED`; mutation `CLONE_MUTATED`; used by C27-C30, S09.
- `PLANNED_SUPPORTING_AUTHORITY H`: ownership, profile and exact-head CI inventories; expected `ACCEPTED`; mutation `NONE`; used by C43-C46, S10-S12.

Implementation assigns unique `SUP-2B19A3B2-NNN` IDs and records Producer, SourceTestOrFixture, AuthorityStatus, UsedByCriteria and the exact permitted MutationDisposition. Supporting authority never substitutes for a primary test.

## Test allowlist

Product/test commit may change only:

- `packages/application/src/game-application-service.test.ts` — all new `[2B19A3B2-*]` tests in the `information-and-later-actions` shard;
- `scripts/vitest-ownership-contracts.mjs` — one active 2B19A3B2 contract after tests/traceability exist;
- `docs/implementation/phase-3-slice-2b19a3b2-test-traceability.md`;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- necessary `docs/agent-loop/AUTOPILOT_STATE.json`, `CURRENT_TASK.md`, `PROJECT_STATE.md`, `AUTOPILOT_LOG.md`;
- one status document named `docs/implementation/phase-3-slice-2b19a3b2-status.md` if the repository workflow requires it.

The application test file must include primary identities, split as needed so one physical identity has exactly one primary layer:

- real combined accepted-stream success;
- no-Vortox accepted control;
- pure aggregation/classification/order controls;
- hostile replay/payload/provenance/window/classification matrix;
- projection/non-leakage/isolation;
- real application failure ports and same-command recovery;
- legacy/prior-slice regression and ownership assertions.

No test may claim accepted-stream integration if its entry is a direct resolver or mutated persisted history.

## Profile-only child-commit allowlist

After three identical full coverage candidates, the profile-only commit may change only:

- `scripts/verify-coverage-obligations.mjs` — one exact approved 2B19A3B2 profile;
- `.github/workflows/ci.yml` — select that exact profile ID, without changing topology or commands except the profile argument;
- one profile document `docs/implementation/phase-3-slice-2b19a3b2-coverage-profile.md`;
- necessary control metadata.

It must not change production, tests, ownership, dependencies, timeouts, retries, pools, thresholds, group membership or diagnostics.

## Documentation and traceability

Implementation traceability at `docs/implementation/phase-3-slice-2b19a3b2-test-traceability.md` must retain every design row and add:

- `ActualTestFile`;
- `ActualTestTitle`;
- `ActualPrimaryLayer`;
- `ActualReachability`;
- `ActualTrust`;
- `SupportingAuthorityId`;
- `MechanismMatch` (`PASS` only when semantically proven);
- actual main assertion, production/formal entry, fault mechanism and mechanism-match explanation.

All `C01-C46` and `S01-S12` rows must exist exactly once. Every referenced support ID resolves exactly once. One physical test identity (`ActualTestFile + ActualTestTitle`) has one primary layer. A layer-only correction follows Governance V1.1; a changed required evidence mechanism is a blocker/reslice, not a traceability edit.

The role matrix update must say only that accepted combined base-plus-gained Dreamer facts are formally counted by the base first-night Mathematician. Dreamer, Mathematician and Philosopher remain `PARTIAL`; Vortox remains `NOT_STARTED`; no role becomes `COMPLETE`.

## Acceptance checks

The implementation is complete only when all of the following are simultaneously proven:

1. real Philosopher chooses Dreamer;
2. exact native canonical DRUNK exists;
3. native V4 and gained V6 settle through formal commands;
4. their fact/source/instance IDs are pairwise distinct as specified;
5. both facts fall in the exact window and qualify;
6. no third player qualifies;
7. distinct-player aggregation yields two rows and dynamic `trueCount=2`;
8. same-player duplicate facts count once while retaining all supporting IDs;
9. NORMAL, PENDING, own-instance/source and out-of-window classifications are exact;
10. effective Vortox yields true `2`, selected `0`, reliability `VORTOX_CONSTRAINED_FALSE`;
11. no-Vortox effective control yields selected equal true and `RULE_CORRECT`;
12. formal Math delivery, settlement, one derived fact, atomic commit and idempotency are exact;
13. accepted replay and hostile replay boundaries pass;
14. player/AI source sees only selected count, non-sources see nothing, and no provenance leaks;
15. failure/receipt/retry matrix and same-command recovery pass;
16. legacy histories and A3A/A3B1/2B19B contracts pass;
17. ownership/traceability contain no missing, duplicate, unexpected, ambiguous, wrong-owner or multi-primary row;
18. three coverage candidates are identical and the exact profile passes;
19. exact-head push and PR CI pass all 23 jobs (validate, 9 ordinary shards, ordinary merge, 10 coverage shards, coverage merge, Windows deterministic);
20. no disabled test, timeout, `onTaskUpdate`, unhandled error, exit 1, profile mismatch or hidden rerun exists.

## Local gates

Run with Node `24.15.0` and pnpm `11.7.0`:

```text
pnpm typecheck
pnpm lint
node scripts/verify-vitest-ownership-contracts.mjs --self-test
focused 2B19A3B2 tests in application-service-information-and-later-actions
focused 2B19A3A, 2B19A3B1 and 2B19B exact tests/contracts
9 ordinary process groups and ordinary merge
inventory audit
10 coverage process groups and coverage merge
coverage obligation audit against the new exact profile
Windows deterministic gate
pnpm test
pnpm test:coverage
git diff --check
```

All must pass on the frozen source/profile heads appropriate to their stage.

## CI and PR

PR title:

```text
Phase 3 Slice 2B19A3B2: integrate combined Dreamer Mathematician count
```

The PR body must contain Rule Evidence, Rule Source Revisions, Rule Claims Implemented, Explicitly Unsupported Rules, Rule-to-Test Traceability, Governance, Frozen Design, Accepted Dependencies, Real Command Stream, Native V4 Fact, Gained V6 Fact, Window, Fact Classification, Distinct-Player Aggregation, True Count, Selected Count, Vortox Constraint, Formal Delivery, Settlement, Ledger, Projection, Receipt and Failure, Legacy Replay, Ownership, Coverage Profile, Tests, CI and Stop-Loss Compliance.

Before final review, freeze the complete PR body and feature HEAD, wait for exact-head push and PR CI, and require every merge-gating check to succeed. Any later commit invalidates CI/review comments and requires fresh exact-head gates.

## Rollback

Because production code and persisted schemas do not change, rollback is removal/revert of the 2B19A3B2 tests, ownership entry, traceability, role/status records and exact profile selector/profile as one coherent Slice. Do not revert or mutate accepted 2B18B, 2B19A3B1, 2B19B or infrastructure authorities. No history rewrite, `reset --hard`, force push or rebase is permitted.

## Stop conditions

Stop with `RESLICE_REQUIRED` if any frozen GO condition becomes false, any production change is required, any stop-loss item triggers, a new trust boundary/semantic decision appears, or two design rounds cannot close an architectural blocker. Stop with `HUMAN_BLOCKED` for rule/source conflict, unavailable required source without approved snapshot, unsafe history rewrite, permissions failure or design-review verdict `HUMAN_BLOCKED`. After two product repair rounds without both final pass verdicts and empty blockers, do not invent another round.

## Completion and release

Only independent `RULE_DESIGN_PASS` authorizes implementation. Only a complete independent final report on the exact frozen PR HEAD containing `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS` and `remainingBlockers=[]`, followed by two verbatim GitHub audit comments re-read and verified, authorizes merge. Post-merge archive and CI provenance follow `AGENTS.md` and `REVIEW_PROTOCOL.md` exactly. Accepted tag:

```text
phase-3-slice-2b19a3b2-combined-dreamer-mathematician-integration
```

After closeout, stop. Do not start another Slice or Phase 2C.

## Explicit out of scope

No new Dreamer opportunity/target/delivery; no source-impaired or POISONED Dreamer success; no No Dashii; no impaired/dead Vortox fallback; no new gained Mathematician behavior; no other-night window; no third abnormal player or more than two Dreamer sources; no general lifecycle, effect graph, multi-night ledger, role/character/alignment/death engine; no Storyteller free-choice completion; no Travellers; no FIRST_NIGHT completion; no DAY; no Phase 2C; no public schema, event, state, evidence, task-order, ownership-schema, workflow-topology, timeout, dependency or threshold change.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
