# Phase 3 Slice 2B19A2 Independent Rule Design Review — Round 1

## Review Metadata

- reviewedDesign: `docs/implementation/phase-3-slice-2b19a2-design.md`
- reviewedDesignSha256: `fe7187b9b027c4579a21d3a0ccf2fd77a3625dfbc0f95ea638ea926c5982cfe0`
- reviewTimestamp: `2026-07-16T17:57:01.4980273+08:00`
- reviewType: `INDEPENDENT_READ_ONLY_RULE_DESIGN_REVIEW`
- designRound: `1 / 2`
- acceptedMain: `8b390b50f5d314b34535bc7cf9fad36ece76f85e`
- implementationStarted: `false`
- ruleSemanticsChanged: `false`
- sliceCoverage: `PARTIAL / NORMAL_INFORMATION_ONLY`
- dreamerRoleCoverage: `PARTIAL`

## Sources Read

### Rule and governance authorities

- `AGENTS.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B19A2-go-no-go-under-governance-v1.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19.md`
- `docs/rules/evidence/2B19A1.md`
- `docs/rules/evidence/2B19A2.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b19a1-design.md`
- `docs/implementation/phase-3-slice-2b19a1-status.md`
- `docs/implementation/phase-3-slice-2b19a2-design.md`
- Official Dreamer fixed revision `oldid=2904`
- Chinese 筑梦师 fixed revision `oldid=3046`
- Official nightsheet fixed commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`

### Production files read

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/projections/src/index.ts`

### Test files read

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

## Governance Review

### GO confirmation

`GO_CONFIRMED`

The design preserves the governance result: one independently versioned actionable opportunity, normal/effective base information only, existing batch/ledger/projection reuse, immutable V1 and Slice 2B19A1 V2 history, and no new shared infrastructure.

### Stop-loss

`PASS`

- exact production allowlist: 6 files;
- estimated added production LOC: 1,100–1,450;
- no new top-level `GameState` field;
- no generic context platform or effect engine;
- no new projection system;
- no new open ledger-evidence family;
- no Vortox, impairment-information, gained-Dreamer, other-night, life/death, DAY, or Phase 2C implementation.

The listed `event-applier.ts` change is a legitimate typed replay adapter inside the governance allowance. No Clockmaker production change is required.

## Reachability Review

| Class | Review result | Notes |
|---|---|---|
| R1 | PASS WITH CONTRACT FIXES REQUIRED | Actionable V3, normal target/information, atomic batch, normal ledger fact, and source-only projection are genuinely reachable through accepted command and replay paths. Four security-critical details remain insufficiently frozen. |
| R2 | PASS | V1, V2-plan plus legacy V1, and immutable Slice 2B19A1 non-actionable V2 histories remain exact replay-only authorities. |
| R3 | PASS WITH TEST-AUTHORITY FIX REQUIRED | Hostile exact-shape, cross-link, duplicate, naked, reversed, partial, and mixed history categories are named, but concrete primary test identities and files are not frozen. |
| R4 | PASS | Vortox forced-false, represented impairment delivery, No Dashii inference, gained Dreamer, Storyteller free choice, Traveller, other-night, life/death, FIRST_NIGHT completion, DAY, and Phase 2C remain unreachable. |

## Trust Review

| Class | Review result | Notes |
|---|---|---|
| T1 | PASS | Command, opportunity, target, delivery, replay, batch, receipt, and viewer boundaries are correctly treated as untrusted exact-shape inputs. |
| T2 | FIX REQUIRED | Rebuilt state, role catalog, current-character state, tenure, task, impairments, Demon identity, and ledger are the right authorities, but the source-effectiveness input and impairment applicability proof are not exact enough. |
| T3 | PASS WITH CONTRACT FIX REQUIRED | ID, normal resolver, false-role selector, and comparison are appropriately pure; the ledger mapping must be frozen so the pure derivation has one canonical interpretation. |

## Independent Pass Confirmations

1. `abilityImpairments === undefined` is accepted only as the historical empty impairment set. It is not permission to treat a present malformed, incomplete, or conflicting impairment set as empty.
2. Receipt placement is implementable using the existing application ordering: deterministic rejection may record a rejected receipt, while source-effectiveness, candidate, metadata, prospective-validation, and append failures return before receipt creation.
3. Current Demon identity and Vortox status can be proven from existing T2 current-character state, exact setup catalog, active role tenure, and represented ability-impairment state. No shared effect engine is required.
4. `event-applier.ts` is a legitimate production scope addition for exhaustive typed V1/V2 event replay and exact state-before validation.
5. Clockmaker requires no production modification. Its first-night order and regression remain test evidence only.
6. The accepted V2 non-actionable opportunity is immutable and replay-only; the new producer emits only the independently discriminated V3 variant.
7. Existing private projection can consume historical V2 delivery without a production projection change.
8. Existing closed ledger evidence variants appear sufficient, subject to freezing the exact V3 field mapping below.

## Findings

### 1. SOURCE_EFFECTIVENESS_INPUT_AND_IMPAIRMENT_APPLICABILITY_NOT_EXACT

Severity: `BLOCKER`

The frozen resolver input names V3 opportunity, current-character state, role catalog, tenures, and impairments, but does not include the scheduled task/progress authority or explicitly state that the already validated V3 opportunity may be trusted as the sole prior proof of task authority. That leaves two possible provenance models and permits implementation divergence.

Round 2 must choose and freeze exactly one model:

- include the canonical first-night task plan/progress in the resolver input and re-prove task authority; or
- state that exact V3 creation/replay provenance is the prior task authority and that the resolver must not reconstruct or accept another task context.

Round 2 must also define exact represented-impairment applicability. An applicable marker must bind, at minimum:

- source player ID;
- source seat number;
- exact Dreamer role/ability identity;
- source role-tenure ID;
- source ability-instance ID when represented by the marker contract;
- marker start/effective revision;
- settlement-time evaluated revision;
- ended/cleared revision bounds;
- impairment kind `DRUNK` or `POISONED`.

The frozen predicate must state how missing, duplicate, overlapping, ended, malformed, cross-player, cross-seat, cross-role, cross-tenure, cross-ability, future-start, and stale marker records classify. `undefined` remains historical-empty only. It may not absorb contradictory or damaged represented state.

### 2. NO_DASHII_CONSERVATIVE_CONTROL_FLOW_NOT_FROZEN

Severity: `BLOCKER`

The design says an effective current No Dashii returns unresolved, but the interaction between Demon effectiveness and future canonical proof of an unaffected Dreamer is not frozen tightly enough.

Round 2 must state the current model's exact behavior: when the unique effective current Demon is `no_dashii`, 2B19A2 always returns `NO_DASHII_EFFECT_UNRESOLVED` because the accepted model contains no canonical adjacency/unaffected proof. The resolver must not infer safety from seat distance, roster order, absence of a POISONED marker, or caller assertions.

A future canonical unaffected proof can change this only in a separately reviewed Slice. No such proof exists in the current authority set.

### 3. V3_LEDGER_CLOSED_EVIDENCE_FIELD_MAPPING_NOT_FROZEN

Severity: `BLOCKER`

The design lists the allowed closed evidence variants but does not map every V3 fact field and evidence field to one exact source. This permits incompatible ledger derivations or accidental generic evidence expansion.

Round 2 must freeze the exact mapping for:

- `SOURCE_EVENT` from the V2 `DreamerInformationDelivered` terminal envelope;
- `TASK` from the unique canonical scheduled Dreamer task;
- `CHARACTER_STATE` for settlement-time evaluated revision;
- source `PLAYER_ROLE_AT_REVISION` at the relevant canonical source revision;
- target `PLAYER_ROLE_AT_REVISION` at settlement revision;
- V3 `ACTION_OPPORTUNITY` from the accepted exact V3 opportunity event/state;
- source `ROLE_TENURE` from the exact active continuous Dreamer tenure;
- fact `abilityInstance` from the canonical base task ability instance;
- `DREAMER_DELIVERY` from the exact terminal V2 delivery fields.

The mapping must state exact IDs, revisions, event IDs, role IDs, task IDs, opportunity ID/schema, target ID, delivered GOOD/EVIL role IDs, batch ID, and event sequence. `BaseDreamerV2SourceContract` versions and nested fields must validate exactly. The ability-instance and opportunity IDs must be validated with the accepted V2 ID parsers/formatters. No generic evidence variant is permitted; inability to express this mapping returns `RESLICE_REQUIRED`.

### 4. PRIMARY_AUTHORITY_TEST_IDS_AND_FILES_NOT_FROZEN

Severity: `BLOCKER`

The design maps all 31 requirements to layers but supplies no concrete test IDs or exact file ownership. That does not satisfy the project's primary-authority audit requirement and leaves accepted-stream claims vulnerable to fixture-only substitution.

Round 2 must assign every numbered requirement:

- one unique stable primary test ID;
- one exact repository test file;
- one primary layer;
- the production boundary exercised;
- whether the test uses real command append/rebuild, legacy replay, hostile replay, pure policy, projection, or CI.

Accepted-stream tests must use the real application command, persisted envelopes, append, rebuild, receipt, task, ledger, and projection path as applicable. Direct builders or manually assembled state cannot be labeled `ACCEPTED_STREAM_INTEGRATION`. Structural mutation coverage must name its exact owning tests and include every missing/extra/wrong/hostile key and required cross-link.

## Required Round 2 Corrections

Round 2 is limited to closing the four blockers above. It must not change:

- external Dreamer rule semantics;
- V1 or accepted V2 exact shapes;
- V3 naming, discriminator, opportunity ID grammar, or visibility contract;
- normal GOOD/EVIL and deterministic false-role semantics;
- Vortox, impairment, No Dashii, or gained-Dreamer scope;
- command actors or atomic batch order;
- projection privacy;
- production allowlist or stop-loss;
- Slice or role coverage status.

## remainingBlockers

1. `SOURCE_EFFECTIVENESS_INPUT_AND_IMPAIRMENT_APPLICABILITY_NOT_EXACT`
2. `NO_DASHII_CONSERVATIVE_CONTROL_FLOW_NOT_FROZEN`
3. `V3_LEDGER_CLOSED_EVIDENCE_FIELD_MAPPING_NOT_FROZEN`
4. `PRIMARY_AUTHORITY_TEST_IDS_AND_FILES_NOT_FROZEN`

## Verdict

The design is directionally within the approved governance and rule scope, and all four blockers can be corrected without a reslice. However, implementation is not authorized because source-effectiveness provenance, No Dashii conservative control flow, V3 ledger derivation, and primary test authority are not yet exact.

RULE_DESIGN_FIX_REQUIRED
