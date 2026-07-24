# Phase 3 Slice 2B19A3B2 Governance GO/NO-GO: Combined Dreamer Mathematician Integration

## Metadata

- Slice: `Phase 3 Slice 2B19A3B2`
- Authorization: `USER_AUTHORIZED_2B19A3B2_COMBINED_DREAMER_MATHEMATICIAN_INTEGRATION`
- Candidate base: accepted `main` at `c0c0cdfef1c1aa4cebb841f9867007a319701459`
- Feature branch: `phase-3/combined-dreamer-mathematician-integration`
- Assessment date: `2026-07-20`
- Governance authority: `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`, including accepted Traceability V1.1
- Review protocol: `docs/agent-loop/REVIEW_PROTOCOL.md`
- Rule evidence: `docs/rules/evidence/2B19A3B2.md`
- Rule evidence SHA-256: `64607c71c5d9b947b78063cdc8e914f684b975748cb2c183fe2e4119b4036eb0`
- Rule verdict: `RULE_READY`
- Rule coverage: `PARTIAL / COMBINED_NATIVE_AND_GAINED_DREAMER_FIRST_NIGHT_COUNT_ONLY`
- Design round authorized after this precheck: `1 / 2`
- Primary risk: `FORMAL_MATHEMATICIAN_DISTINCT_PLAYER_AGGREGATION_ACROSS_NATIVE_AND_GAINED_DREAMER`
- Product behavior to add: no new semantic behavior; prove and accept the already-reachable combined first-night command path through formal base Mathematician settlement.
- BOTC rule semantics changed: `false`
- Public event/state/payload schema changed: `false`
- Dreamer V1-V6 behavior changed: `false`

## Authority and repository state

The assessment read the ordered project handoff, `AGENTS.md`, the governance ADR, `AUTOPILOT_PROMPT.md`, `REVIEW_PROTOCOL.md`, current control/status files, `USER_OVERRIDES.md`, `ROLE_COVERAGE_MATRIX.md`, current 2B19A3B2 evidence, accepted 2B18B/2B19A3B1/2B19B evidence/design/traceability/reviews, and the current Mathematician, Dreamer, application, ledger, batch, replay, projection, receipt, ownership and coverage implementation.

At assessment time:

- local HEAD, `origin/main`, and GitHub `main` all equal `c0c0cdfef1c1aa4cebb841f9867007a319701459` as the branch base;
- open pull requests: `0`;
- current branch: `phase-3/combined-dreamer-mathematician-integration`;
- only the authorized control files and `docs/rules/evidence/2B19A3B2.md` are uncommitted;
- `ruleReady=true`, `ruleDesignPass=false`, `implementationAuthorized=false`;
- Phase 2C is not started.

## Accepted dependencies

The following accepted authorities are prerequisites, not change targets:

1. 2B19T canonical role-tenure history.
2. 2B18A first-night ability-outcome ledger.
3. 2B18B formal Mathematician command, resolver, payload, batch, replay, projection and receipt behavior.
4. 2B19A3A effective-current-Vortox base Dreamer.
5. 2B19A3B1 native/base Dreamer V4 canonical Philosopher-produced DRUNK plus Vortox fact.
6. 2B19B Philosopher-gained Dreamer V4 opportunity and V6 terminal fact, including the real continuation through Seamstress to the unsettled Mathematician boundary.
7. Vitest multi-slice ownership registry, nine ordinary process groups, ten coverage process groups and accepted exact coverage profile machinery.

The PR #41 archived final review proves 2B19B was accepted at frozen feature HEAD `f90b4909c3883c3853d93cc444a823ce07078e61`, merged as `319c93d057359eaa542507c48f9d0f74ecda6b88`, with both final pass verdicts and no blocker. The current accepted main incorporates that history.

## Rule gate

Fresh rule research checked the approved overrides, fixed Chinese Wiki revisions, fixed official BOTC Wiki revisions and official nightsheet. It concluded:

- Mathematician counts distinct players, not facts;
- multiple qualifying facts for one player count once but remain supporting evidence;
- the native Dreamer player and the Philosopher player are distinct contributors;
- both accepted V4 and V6 Vortox facts qualify inside the approved first-night window;
- current Mathematician resolution excludes its own source/instance;
- true count is dynamic and equals `2` only in the frozen two-contributor scenario;
- effective Vortox constrains selected count, not true count;
- no new override is required;
- unresolved conflicts are empty.

Therefore rule truth does not block governance design.

## Reachability precheck

### R1 — currently reachable application paths

The following complete prefix is currently reachable only through real application commands and accepted events:

```text
CreateGame
→ SelectScript
→ GenerateSetup
→ CreatePlayerRoster
→ AssignCharacters
→ InitializeFirstNight
→ PlanFirstNightTasks
→ settle real predecessors
→ OpenFirstNightRoleActionOpportunity(PHILOSOPHER_ACTION)
→ SubmitPhilosopherAction(CHOOSE_GOOD_CHARACTER dreamer)
→ accepted grant, insertion and canonical native-Dreamer DRUNK
→ settle remaining real predecessors
→ OpenFirstNightRoleActionOpportunity(base DREAMER_ACTION V3)
→ SubmitDreamerAction
→ accepted native Dreamer target + V4 delivery + settlement
→ OpenFirstNightRoleActionOpportunity(gained DREAMER_ACTION V4)
→ SubmitDreamerAction
→ accepted gained Dreamer target + V6 delivery + settlement
→ OpenFirstNightRoleActionOpportunity(SEAMSTRESS_ACTION)
→ SubmitSeamstressAction(DEFER)
→ SettleMathematicianInformation(base MATHEMATICIAN_INFORMATION)
→ accepted MathematicianInformationDelivered + ScheduledTaskSettled
```

The 2B19B accepted-stream authority already proves the prefix through gained V6 and the real Seamstress terminal action, with base Mathematician next and unsettled. The formal `SettleMathematicianInformation` command is accepted production behavior from 2B18B. Combining those two accepted paths requires no synthetic state, handwritten ledger, direct fact append, skipped task or fake task progress.

R1 also includes formal command rejection and fault paths for actor, command shape, version, next-task/source validity, unresolved canonical history, metadata, prospective validation, accepted commit and receipt ports. Those rows are application-command integration unless a complete success is asserted.

### R2 — legacy or imported accepted history

Accepted 2B18B base/V1/V2 Mathematician histories and accepted Dreamer V1-V6 histories keep their existing exact replay promises. The Slice adds no migration and does not reinterpret an old payload. Legacy V1 duplicate-holder Mathematician ordering remains explicitly unsupported under its accepted Option A boundary.

### R3 — hostile or corrupted history

R3 comprises manual mutations of otherwise accepted prefixes or the final Mathematician pair: duplicate fact IDs, duplicate supporting IDs, wrong or duplicate source identities, wrong seat/task/night/instance/tenure, facts outside the window, missing initialization, wrong upper boundary, wrong true/selected count, wrong classification arrays, unsorted IDs, forged Vortox provenance, partial/reordered/duplicated/cross-batch events, and hostile proxy/getter/symbol/cycle/nonplain T1 values. These must fail closed at the existing event-stream, exact-shape, replay, batch or projection boundary. No R3 row may be called accepted-stream integration.

### R4 — future or hypothetical behavior

The following remain R4 and cannot gate this Slice: source-impaired gained Dreamer success, POISONED Dreamer success, No Dashii derivation, dead/impaired/stale Vortox fallback, third abnormal player, more than two Dreamer sources, gained Mathematician new behavior, other-night Mathematician, general multi-night ledger, general lifecycle/death/change engine, FIRST_NIGHT completion, DAY and Phase 2C.

## Trust precheck

- `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`: command envelope/payload, accepted/imported events, stored deliveries/facts/settlements, projection viewer identity, receipt/commit ports. Existing exact-shape and hostile-data validation remains mandatory.
- `T2 CANONICAL_DERIVED_STATE`: rebuilt `GameState`, validated task plan/progress, role tenure, impairment, ledger and the derived Mathematician resolution. The combined count must be reconstructed from the accepted prefix.
- `T3 MODULE_PRIVATE_PURE_CORE`: distinct-player grouping, code-unit sorting, numeric candidate selection and comparison. No new public boundary is created.

No trust level is weakened or reclassified.

## R1-R4 evidence requirements

### R1 required proof

The new primary authority must invoke every step through `GameApplicationService`, load the accepted event stream from the real command store, rebuild through `rebuildGameState`, and assert the formal Mathematician result and authorized projection. It must not mutate or synthesize accepted events. It must prove:

- native V4 and gained V6 have distinct `sourcePlayerId`, `abilityInstanceId` and fact IDs;
- both are in the exact count window and both classify as qualifying;
- no third player qualifies;
- the base Mathematician command produces the existing exact two-event atomic batch;
- the event applier derives exactly one Mathematician outcome fact, not a third batch event;
- task state advances from pending to settled while phase remains `FIRST_NIGHT`;
- accepted-stream player and AI views reveal only `{ count: selectedCount }` to the Mathematician source.

### R2 required proof

Existing valid base, V1, V2 and Option A histories replay with the same meaning. The current producer does not migrate or rewrite them.

### R3 required proof

Hostile clones must exercise the real persisted/replay boundary. Direct shape tests are structural-validation authority only. Getters must not be invoked. Partial Mathematician batches, payload self-claims and caller-supplied ledgers/windows must never establish provenance.

### R4 recording

R4 behaviors are listed as unsupported and receive no producer, event, schema, state field or acceptance dependency.

## Thirteen GO conditions

| # | Condition | Repository proof | Verdict |
|---:|---|---|---|
| 1 | Accepted bridge prefix exists | 2B19A3B1/2B19B real command helpers create V4 then V6; 2B19B settles real Seamstress and stops at Math | GO |
| 2 | Base Mathematician command is reachable | `SettleMathematicianInformation` command, validator and application dispatch are active; 2B18B base fixture settles it | GO |
| 3 | Consumer supports multiple facts | `resolveMathematicianCountFromValidatedFactsForInternalValidation` iterates the complete validated ledger fact array | GO |
| 4 | Consumer supports distinct-player dedup | the resolver groups qualifying facts in `Map<PlayerId, FirstNightAbilityOutcomeFact[]>`, emits one player record per key and preserves all supporting IDs | GO |
| 5 | No new event type | existing `MathematicianInformationDelivered` and `ScheduledTaskSettled` form success; ledger fact is derived during event application | GO |
| 6 | No new `GameState` field | existing Mathematician information, task progress and outcome ledger contain the result | GO |
| 7 | No new evidence variant | existing V4/V6 source, task, character-state, tenure, impairment, Vortox and delivery references validate both facts | GO |
| 8 | No Dreamer V4/V6 change | both terminal producers and validators are accepted and sufficient; they are frozen outside the production allowlist | GO |
| 9 | No public Mathematician payload change | existing payload already carries window, classifications, distinct players, true/selected counts, source/Vortox contracts and knowledge fields | GO |
| 10 | No task-order change | accepted V2 order is base Dreamer, gained Dreamer, Seamstress, base Mathematician | GO |
| 11 | No new override | 2B19A3B2 rule evidence applies the existing six relevant approved policies and reports no conflict | GO |
| 12 | Predicted production files within limit | production change allowlist is empty; predicted count `0` | GO |
| 13 | Predicted added production LOC within limit | production additions `0` | GO |

All thirteen conditions pass.

## Exact window and aggregation seam

The existing `FirstNightMathematicianCountWindow` is sufficient and immutable:

```text
windowVersion = first-night-ability-outcome-window-v1
nightNumber = 1
startEventSequence = FirstNightInitialized.eventSequence
startBoundary = EXCLUSIVE
endEventSequence = accepted prefix lastEventSequence immediately before delivery
endBoundary = INCLUSIVE
```

The current delivery has `deliveryEventSequence=endEventSequence+1` and is outside its own window. The resolver classifies each validated fact in this order: resolving ability instance exclusion; resolving source player exclusion; `NORMAL`; `PENDING_TRIGGER`; qualifying `ABNORMAL && causedByAnotherCharacterAbility`; unresolved/redundant. Qualifying facts group by `sourcePlayerId`; supporting fact IDs are unique and code-unit sorted; player rows sort by seat then player ID; `trueCount=distinctAbnormalPlayers.length`. The frozen bridge yields `2`, but no production constant or scenario-specific branch may encode `2`.

## Vortox and delivery seam

For the frozen bridge, base Mathematician is effective and the current Vortox is effective. The existing candidate resolver therefore produces:

```text
trueCount = 2
candidateDomain = [0,1,2,3,4,5,6,7,8,9,10,11]
legalCandidateCounts = [0,1,3,4,5,6,7,8,9,10,11]
selectedCount = 0
informationReliability = VORTOX_CONSTRAINED_FALSE
vortoxConstraint.kind = VORTOX_FALSE_REQUIRED
```

The user-facing term `VORTOX_FALSE` maps to the accepted payload literal `VORTOX_CONSTRAINED_FALSE`; the Slice must not rename that public literal. Without applicable Vortox and with an effective source, the accepted resolver produces `selectedCount=trueCount` and `RULE_CORRECT`.

## Scope and stop-loss

This is a test-and-acceptance integration Slice. Production file changes: `0`; added production LOC: `0`. Expected implementation files are one existing application test file, the ownership registry, implementation traceability, role coverage/control/status documents, and the exact coverage profile/selector artifacts in a later profile-only commit. No workflow topology, timeout, dependency, threshold or process group may change.

The Slice must reslice immediately if implementation discovers any need for:

- a production code change;
- a new event, state field, evidence reference, payload version, task order, override, generic ledger engine or multi-night abstraction;
- modification of Dreamer V4/V6 or accepted Mathematician public contracts;
- more than the frozen test/document/registry/profile allowlist;
- a third independent subsystem or an R4 prerequisite.

## Governance conclusion

The primary risk is already served by an R1 accepted bridge and an R1 formal Mathematician producer. The existing consumer, window, batch, replay and projection contracts are structurally sufficient. The missing artifact is a bounded formal integration authority proving the combined path and its negative boundaries. This can be implemented without product semantics or production code changes.

## Decision

`GO`

This GO authorizes only Design Round 1 for 2B19A3B2. It does not authorize implementation before independent `RULE_DESIGN_PASS`, and it does not authorize 2B19A3B3, another Slice, FIRST_NIGHT completion, DAY or Phase 2C.

GO
