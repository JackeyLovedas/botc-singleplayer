# Phase 3 Slice 2B19A3A Go/No-Go Under Governance V1

## Assessment Metadata

- Authorization: `USER_AUTHORIZED_2B19A3_RESLICE_TO_ACCEPTED_STREAM_EFFECTIVE_VORTOX_ONLY`
- Assessment type: read-only product-Slice governance precheck
- Candidate: `Phase 3 Slice 2B19A3A — Effective Base Dreamer + Effective Vortox Forced-False Information`
- Accepted main assessed: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- Candidate branch: `phase-3/dreamer-vortox-effective-source`
- Repository visibility: `PUBLIC`
- GitHub main: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- `origin/main`: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- Open pull requests: `0`
- Exact archive-main CI: run `29553826536`, `SUCCESS`
- Prior Slice 2B19A3 terminal state: `RESLICE_REQUIRED`
- Prior Slice 2B19A3 Design Round 3 authorized: `false`
- Candidate implementation started: `false`
- Production or test files changed for 2B19A3A: `false`
- Current dirty files: only the four 2B19A3A control/status documents
- Candidate Slice coverage if accepted: `PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`
- Dreamer role coverage if accepted: `PARTIAL`
- Primary risk: `EFFECTIVE_VORTOX_FALSE_INFORMATION_FOR_EFFECTIVE_BASE_DREAMER`
- Conclusion: `GO`

`GO` authorizes only fresh rule research, materialization of `docs/rules/evidence/2B19A3A.md`, and subsequent bounded design review. It is not `RULE_READY`, `RULE_DESIGN_PASS`, or implementation authorization.

## Authorities And Repository Material Inspected

### Governance and handoff

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- `project-handoff/PROJECT_HANDOFF.md`
- `project-handoff/PRODUCT_SCOPE.md`
- `project-handoff/RULES_BASELINE.md`
- `project-handoff/ARCHITECTURE_INPUT.md`
- `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
- `project-handoff/OPEN_RISKS.md`
- `project-handoff/DEVELOPMENT_ROADMAP.md`
- `project-handoff/rules/11-drunk-and-poison.md`
- `project-handoff/rules/12-information-model.md`
- `project-handoff/rules/18-sects-and-violets-roles.md`
- `project-handoff/rules/19-sects-and-violets-demons.md`
- `project-handoff/tests/25-rule-test-cases.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`

### Accepted Dreamer authorities

- accepted Slice 2B19T design/status and role-tenure implementation;
- accepted Slice 2B19A1 governance, design, review, status, and opportunity contract;
- accepted Slice 2B19A2 governance, frozen Round 2 design, reviews, status, and traceability;
- archived Slice 2B19A3 governance, Round 1/2 designs, and independent Round 1/2 reviews;
- `docs/rules/evidence/2B19.md`
- `docs/rules/evidence/2B19A1.md`
- `docs/rules/evidence/2B19A2.md`
- archived `docs/rules/evidence/2B19A3.md`

### Production code inspected

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/role-tenure-replay.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

### Tests and accepted-stream support inspected

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream-fixture.ts`
- `packages/test-harness/src/fixtures/dreamer-v3-accepted-stream.json`

Focused accepted-producer regressions were executed read-only:

- `[2B19A2-C15]` passed: a real Philosopher choice of Dreamer produces the represented `DRUNK` marker on the base Dreamer and the Dreamer command fails receipt-free.
- `[2B19A2-C17]` passed: a real accepted Vortox setup reaches the base Dreamer command and currently fails receipt-free as unsupported.

## Executive Finding

Accepted main already supplies:

- a V2 first-night plan and base Dreamer task;
- an actionable V3 Dreamer opportunity;
- a canonical base Dreamer source contract and ability-instance identity;
- canonical assignment-derived role tenures;
- the complete accepted represented `AbilityImpairmentSet`;
- settlement-time current character state and role catalog;
- generic `SubmitDreamerAction`;
- atomic target/delivery/settlement batch semantics;
- per-event replay validation with the canonical pre-event `GameState`;
- a derived first-night outcome ledger with existing `VORTOX_FALSE_INFORMATION`;
- existing Mathematician consumption of `ABNORMAL` facts caused by another character;
- accepted-event-stream-only private projection infrastructure;
- stable code-unit role ordering and existing Dreamer pair construction.

The failed 2B19A3 design coupled source impairment precedence, hypothetical impaired-Vortox paths, stored-state negative provenance, and an overclaimed ledger evidence contract. The authorized reslice removes those risks. It can support only a proven-effective base Dreamer and a proven-effective current Vortox, while preserving every source-impaired path as unsupported.

No new event type, top-level `GameState` field, evidence variant, generic applicability platform, generic context, public state-only resolver, or Mathematician production change is required.

## Actual Accepted-Producer Reachability

### R1 — `CURRENTLY_REACHABLE_ACCEPTED_STREAM`

The candidate may make only this successful path reachable:

1. a base Dreamer has the accepted actionable V3 opportunity;
2. the source remains the unique current base Dreamer with its active canonical tenure;
3. the complete represented impairment aggregate contains no applicable source impairment;
4. exactly one current Demon exists and is catalog-bound Vortox;
5. that Vortox has exactly one active canonical tenure;
6. the complete represented impairment aggregate contains no applicable Vortox impairment;
7. the chosen target is another modeled player;
8. the generated GOOD and EVIL roles both exclude the target’s settlement-time true role;
9. target, V3 delivery, and settlement commit atomically;
10. one `ABNORMAL / VORTOX_FALSE_INFORMATION / causedByAnotherCharacterAbility=true` ledger fact is derived;
11. existing Mathematician logic counts the Dreamer source once under its existing temporal and distinct-player rules;
12. only the Dreamer source’s accepted-stream player and AI projections expose the target and pair.

Existing accepted commands already reach the same source/opportunity/Vortox boundary and return receipt-free `ApplicationNotConfigured`. The Slice changes only the proven-effective Vortox branch into the above accepted producer.

### R1_REACHABLE_BUT_EXPLICITLY_UNSUPPORTED

`source DRUNK + effective Vortox` is genuinely reachable and must not be labeled R4.

Proof:

- `SubmitPhilosopherAction` accepts `CHOOSE_GOOD_CHARACTER: dreamer`;
- its accepted batch produces `PhilosopherAbilityGranted` and `AbilityImpairmentApplied`;
- Philosopher is ordered before the base Dreamer task;
- `[2B19A2-C15]` proves the accepted producer reaches the base Dreamer with a represented `DRUNK` marker;
- accepted exact-role setups already compose Dreamer, Philosopher, and Vortox in one legal first-night plan.

This path remains:

- `ApplicationNotConfigured`
- `failureStage=first-night-role-action`
- retryable
- receipt-free
- zero events
- unchanged game version
- opportunity `OPEN`
- no delivery, settlement, or ledger fact.

The existing source-effectiveness precedence remains authoritative: source impairment is detected before any supported Vortox delivery branch.

### R2 — `LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`

The following stay replay-compatible and gain no new producer or reinterpretation:

- legacy Dreamer V1 opportunity, target, delivery, settlement, ledger, and projection history;
- Slice 2B19A1 non-actionable opportunity V2 history;
- Slice 2B19A2 normal delivery V2 history.

`dreamer-information-delivered-v2` remains exact and unchanged. V3 is additive.

### R3 — `HOSTILE_OR_CORRUPTED_HISTORY`

R3 includes:

- malformed, extra-key, missing-key, wrong-literal, noncanonical, proxy, getter, symbol, cycle, or nonplain V3 payloads;
- wrong Vortox player, seat, role, tenure, or evaluated revision;
- missing or duplicate required tenure;
- a V3 pair containing the target’s true role;
- wrong GOOD/EVIL native type;
- corrupted source or target cross-links;
- naked, reordered, split, cross-batch, duplicate, or partially appended target/delivery/settlement events;
- forged V3 ledger linkage;
- forged V3 supplied to a state-only private projection;
- candidate shortage produced only by a malformed/substituted catalog.

A legal accepted 12-player setup has multiple GOOD roles and multiple EVIL roles, so candidate shortage is not an R1 application history.

### R4 — `FUTURE_HYPOTHETICAL_STATE`

Repository code proves these paths have no accepted producer that can create an applicable current marker:

- `source POISONED + effective Vortox`;
- current Vortox `DRUNK`;
- current Vortox `POISONED`;
- ineffective Vortox plus an impaired source;
- any general non-Vortox impairment-information delivery.

The only accepted poison producer is `SNAKE_CHARMER_DEMON_HIT`. It poisons the old Demon and performs the Demon/Snake Charmer transition. Its stored `affectedRole` is the old Demon role, while that player no longer holds that role after the swap. It cannot produce an applicable Dreamer poison marker or an applicable impairment on the new current Vortox.

The Philosopher duplicate producer can create `DRUNK` only for an already held GOOD chosen role. It can therefore affect the base Dreamer, but cannot choose or impair Vortox.

These R4 paths may have pure policy seams, but they are not accepted-stream tests and are not current Slice blockers.

Also R4:

- No Dashii poisoning derivation;
- gained Dreamer execution;
- Storyteller free role selection;
- post-delivery character-change production;
- other-night Dreamer or Vortox behavior;
- general role/effect lifecycle;
- FIRST_NIGHT completion, DAY, and Phase 2C.

## Trust Classification

### T1 — `EXTERNAL_OR_PERSISTED_BOUNDARY`

- `SubmitDreamerAction`;
- V3 `DreamerInformationDelivered` payload;
- persisted domain-event envelope and event stream;
- accepted-stream replay;
- projection viewer identity and accepted-stream projection entry.

These boundaries retain exact runtime shape, canonical IDs, dense arrays, hostile-object rejection, batch metadata validation, replay validation, and provenance checks.

### T2 — `CANONICAL_DERIVED_STATE`

- `GameState` rebuilt from an accepted complete-batch prefix;
- event-applier state immediately before V3 delivery;
- current-character entries and unique current Demon;
- base Dreamer active tenure;
- Vortox active tenure;
- complete represented `AbilityImpairmentSet`;
- role-catalog snapshot;
- first-night plan/progress;
- open opportunity and target choice;
- derived outcome ledger.

Absence of an applicable Vortox impairment is proved only here, from the complete canonical pre-event aggregate. It is not a payload field or a ledger evidence record.

### T3 — `MODULE_PRIVATE_PURE_CORE`

- forced-false GOOD/EVIL candidate selector;
- exact V3 payload constructor;
- stable UTF-16 code-unit comparator;
- positive canonical identity formatter/parser;
- typed equality and cloning for the additive V3 union.

T3 does not receive caller-supplied absence claims and does not become a public state-only applicability resolver.

## Accepted-Stream Pre-State Proof

There is one necessary atomicity qualification.

`rebuildGameState()` correctly rejects the illegal half-batch prefix ending after `DreamerTargetChosen`, because the accepted Dreamer batch must contain exactly:

1. `DreamerTargetChosen`
2. `DreamerInformationDelivered`
3. `ScheduledTaskSettled`

Therefore the design must not claim that a partial atomic batch is independently accepted history.

The valid non-circular proof is:

1. rebuild the maximal accepted complete-batch prefix immediately before the Dreamer three-event batch;
2. validate the complete proposed batch against that canonical state;
3. during full replay, apply `DreamerTargetChosen`;
4. before applying `DreamerInformationDelivered`, run the same applicability core against the event-applier pre-event state;
5. recompute the expected V3 delivery and compare it exactly;
6. apply delivery and settlement;
7. derive the ledger fact from that same canonical pre-delivery state.

`DreamerTargetChosen` changes none of:

- current characters;
- Demon identity;
- role tenures;
- `AbilityImpairmentSet`;
- role catalog.

Consequently, the batch-start canonical state and the event-applier state immediately before delivery have identical Vortox applicability inputs. Both originate from the accepted stream; neither trusts delivery self-assertion or caller context.

Existing `rebuildGameState()` already validates the complete batch before applying it and `applyDomainEvent()` already supplies the exact pre-event state to delivery validation and outcome-ledger derivation.

## Ledger Sufficiency Without New Evidence

The existing ledger contract already contains:

- `outcomeStatus=ABNORMAL`;
- `causeKind=VORTOX_FALSE_INFORMATION`;
- `causedByAnotherCharacterAbility=true`;
- `SOURCE_EVENT`;
- `TASK`;
- `ACTION_OPPORTUNITY`;
- `CHARACTER_STATE`;
- `PLAYER_ROLE_AT_REVISION`;
- `ROLE_TENURE`;
- `DREAMER_DELIVERY`.

The current validator already understands positive Vortox role/active-tenure evidence and Mathematician already counts an abnormal fact caused by another character.

The implementation needs only a V3-specific derivation and conditional-validation branch using the existing union. It must not add impairment-absence evidence. Replay proves the complete absence before deriving the fact.

The current generic Dreamer abnormal validation assumes an `ABILITY_IMPAIRMENT` for abnormal Dreamer information. The bounded design must exempt exactly `VORTOX_FALSE_INFORMATION` from that source-impairment requirement while retaining its existing positive Vortox role and active-tenure requirements.

No Mathematician resolver, delivery, public event, numeric policy, temporal window, own-ability exclusion, or distinct-player logic changes.

## Projection Sufficiency

The repository already has:

- state-only private projection functions; and
- accepted-event-stream private projection functions.

The candidate must:

- reject V3 history at the state-only projection entry because that entry cannot authenticate Vortox impairment absence;
- permit V3 only through the existing accepted-event-stream projection path after replay validation;
- keep V1/V2 state-only behavior unchanged;
- expose only target, GOOD role, EVIL role, knowledge stage, and knowledge-model version to the source;
- expose the same information to the source AI;
- expose no Dreamer information to non-source viewers;
- expose no Vortox identity, reliability, cause, tenure, impairment, true-role marker, or ledger data.

This can reuse the existing internal accepted-history authorization path. It does not require a new public resolver or public context.

## Likely Production Scope

Recommended production allowlist:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

No change is expected in:

- `events.ts`;
- `game-state.ts`;
- `event-applier.ts`;
- `rebuild.ts`;
- `first-night-action-opportunity.ts`;
- `mathematician.ts`;
- `mathematician-internal.ts`;
- workflows, dependencies, timeouts, or CI configuration.

Expected changed production files: `5`.

Expected added production LOC: `700–950`.

The estimate fits the requested ceiling of no more than six production files and 1,000 added production LOC.

## GO Conditions

| # | Condition | Result | Repository proof |
|---|---|---|---|
| 1 | Canonical state can be rebuilt from an accepted prefix before delivery | PASS | Rebuild the maximal complete-batch prefix before the Dreamer batch; full replay then supplies the exact event-applier pre-delivery state. A half-batch prefix is deliberately invalid and must not be claimed as accepted history. |
| 2 | Pre-delivery state identifies the current Vortox | PASS | `currentCharacterState` plus catalog snapshot supports one exact current Demon and exact `roleId=vortox`. |
| 3 | Pre-delivery state identifies the Vortox active tenure | PASS | Assignment-derived and transition-reconciled `RoleTenureState`, exact validation, and `findUniqueActiveRoleTenure` are accepted infrastructure. |
| 4 | Pre-delivery state contains the complete represented impairment set | PASS | Every accepted `AbilityImpairmentApplied` event is validated and appended during replay; the union is closed to Philosopher duplicate DRUNK and Snake Charmer Demon-hit POISONED. |
| 5 | Replay can prove no applicable Vortox impairment | PASS | The same T2 resolver checks the complete exact aggregate, player/seat/role snapshot, tenure interval, revision, duplicate IDs, and conflicts before V3 is admitted. |
| 6 | Event payload need not store negative impairment-absence evidence | PASS | V3 stores positive Vortox identity/tenure/revision facts only; absence is replay-derived. |
| 7 | No new ledger evidence variant is required | PASS | Existing role, tenure, target, delivery, source-event, task, opportunity, and character-state evidence represent the fact; replay proves absence outside the evidence union. |
| 8 | No state-only public applicability resolver is required | PASS | Extend the existing Dreamer capability path and existing accepted-stream projection boundary; state-only V3 projection fails closed. |
| 9 | Normal V2 delivery remains unchanged | PASS | V3 is an additive discriminated delivery variant; V1 and V2 exact shapes, constructors, replay, ledger meaning, and projection remain R2-compatible. |
| 10 | Estimated production scope is at most six files and 1,000 LOC | PASS | Five production files, estimated 700–950 added LOC. |

All ten conditions pass.

## Governance Risks To Freeze In Design Review

1. The design must explicitly distinguish the accepted complete-batch prefix from an invalid half-batch prefix.
2. V3 applicability must use the same T2 core in command decision, prospective batch validation, replay delivery validation, and ledger derivation.
3. The existing `historicalVortoxApplicability` helper does not inspect impairments and is not sufficient authority for V3.
4. Source impairment must retain precedence. A reachable source-DRUNK/Vortox state must never fall through to V3.
5. Source POISONED and current-Vortox impairment tests must be labeled R4 pure seams unless a separately accepted producer is introduced.
6. Candidate shortage is R3, not accepted-stream R1.
7. State-only projection must reject V3; accepted-stream projection is the only complete V3 private-knowledge authority.
8. Ledger validation must permit abnormal Dreamer without source-impairment evidence only for the exact Vortox cause and positive Vortox role/tenure chain.
9. Existing V2 bytes, exact keys, equality, cloning, replay, and projection behavior must not change.
10. Mathematician production must remain untouched; only existing ledger consumption is regression-tested.

No unresolved governance blocker remains if these points are frozen in the bounded design.

## Stop-Loss

Return `RESLICE_REQUIRED` before implementation if any of the following becomes necessary:

- more than eight production files;
- more than 1,500 added production lines;
- a new domain event type;
- a new top-level `GameState` field;
- a new `AbilityOutcomeEvidenceReference` variant;
- a generic negative-evidence schema;
- a new generic canonical context;
- a public state-only Vortox applicability resolver;
- a generic Vortox or impairment platform;
- source-impaired Dreamer delivery semantics in 2B19A3A;
- changes to Mathematician production contracts;
- weakening V1/V2 replay or state-only legacy projection;
- accepting a partial atomic batch as canonical history;
- an architecture blocker remaining after two design rounds.

Return `HUMAN_BLOCKED` for a substantive fresh rule conflict, unavailable mandatory source without an approved snapshot, unsafe history rewrite, or permission failure.

## Conclusion

The accepted repository can support one bounded effective-source/effective-Vortox Dreamer Slice using canonical accepted-stream pre-state proof. The previous negative-provenance blocker is avoided by deriving Vortox impairment absence from the complete T2 pre-event aggregate, not from payload or ledger omission. Existing event, state, ledger, projection, and Mathematician infrastructure is sufficient within five likely production files and an estimated 700–950 added production LOC.

Fresh rule research and independent rule-design review remain mandatory. No production or test edit is authorized by this precheck.

GO
