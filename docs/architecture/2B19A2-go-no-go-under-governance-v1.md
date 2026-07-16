# Phase 3 Slice 2B19A2 Go/No-Go Under Governance V1

## Assessment Metadata

- Authorization: `USER_AUTHORIZED_2B19A2_EFFECTIVE_BASE_DREAMER_V2_NORMAL_INFORMATION`
- Assessment type: read-only product-Slice governance precheck
- Accepted main assessed: `8b390b50f5d314b34535bc7cf9fad36ece76f85e`
- Candidate: `Phase 3 Slice 2B19A2 — Effective Base Dreamer V2 Normal Target and Information Delivery`
- Accepted prerequisites: Slice 2B19T, Slice 2B19A1, and Vitest Coverage Single-Fork V1
- Implementation started: `false`
- Product or test files changed by this assessment: `false`
- Rule semantics changed: `false`
- Candidate Slice coverage if accepted: `PARTIAL / NORMAL_INFORMATION_ONLY`
- Dreamer role coverage: `PARTIAL`
- Conclusion: `GO`

`GO` permits only the mandatory rule-delta and design-review gates. It is not `RULE_DESIGN_PASS`, implementation authorization, or evidence that the candidate behavior is already implemented.

## Executive Finding

Accepted main supplies the required task-plan, base Dreamer task, canonical Dreamer tenure, canonical base ability-instance identity, immutable Slice 2B19A1 non-actionable V2 opportunity, generic `SubmitDreamerAction`, existing V1 Dreamer target/delivery policy, atomic domain-batch semantics, first-night outcome ledger, private projection, and prospective-validation patterns.

The candidate can be bounded to one primary risk: make a new independently versioned actionable base Dreamer opportunity reachable, select another modeled non-Traveller player, resolve only effective normal information, atomically persist target/delivery/settlement, record exactly one normal ledger fact, and expose the historical delivery only to the source player's private player and AI views.

The existing Slice 2B19A1 `dreamer-first-night-action-opportunity-v2` exact shape remains immutable. Its producer is replaced only for new accepted V2-plan base openings; its stored history remains replay-only. No event migration is required.

## Accepted Dependencies

- `first-night-task-plan-v2` and its base Dreamer scheduled task.
- Canonical active Dreamer tenure and current-character correspondence from accepted Slice 2B19T.
- Canonical base first-night ability-instance identity.
- Accepted Slice 2B19A1 non-actionable V2 opportunity and its exact replay contract.
- Existing generic `SubmitDreamerAction` application boundary.
- Existing V1 Dreamer role-catalog, target, delivery, private-projection, and outcome-ledger patterns.
- Existing prospective event validation, atomic batch validation, and accepted replay.
- Accepted single-fork coverage execution; this candidate needs no workflow, dependency, timeout, or coverage-policy change.

## Reachability Classification

### R1 — Target reachable behavior

The candidate may make only the following new behavior reachable:

1. A new independently versioned actionable base Dreamer opportunity for new V2-plan openings.
2. Selection of one other modeled non-Traveller player.
3. Settlement-time normal information for a proven-effective base Dreamer source.
4. One deterministic GOOD role and one deterministic EVIL role, with exactly one equal to the target's settlement-time current true character.
5. One atomic target/delivery/settlement batch.
6. Exactly one terminal `NORMAL` first-night ledger fact.
7. Historical private delivery to the source player's player view and corresponding AI view only.

### R2 — Accepted replay-only history

The following histories remain exact replay authorities and gain no new producer:

- accepted V1 opportunity, target, delivery, settlement, projection, and ledger history;
- accepted V2-plan plus legacy-V1 opportunity history;
- accepted Slice 2B19A1 immutable non-actionable V2 opportunity history.

No R2 payload is rewritten, migrated, widened with optional fields, or reinterpreted as the new actionable variant.

### R3 — Hostile and damaged history

The design must fail closed for:

- mixed opportunity schema or generation;
- missing, extra, malformed, or noncanonical fields and identifiers;
- source, target, player, seat, task, tenure, ability-instance, revision, or role mismatch;
- duplicate target, delivery, settlement, or ledger production;
- naked, reordered, reversed, partially appended, or cross-batch events;
- damaged receipt history;
- caller-supplied context that conflicts with canonical rebuilt state.

### R4 — Explicitly unreachable behavior

The candidate must not make these paths reachable:

- Vortox forced-false Dreamer information;
- DRUNK or POISONED Dreamer information generation;
- No Dashii adjacency poisoning derivation;
- Philosopher-gained Dreamer;
- Storyteller free false-role choice;
- Traveller targeting;
- other-night Dreamer;
- life/death behavior;
- first-night completion, DAY, or Phase 2C.

## Trust Classification

### T1 — Untrusted external or persisted inputs

The following must receive exact-shape and provenance validation:

- `SubmitDreamerAction` command input;
- actionable opportunity event and stored payload;
- target and delivery event payloads;
- persisted event replay and batch metadata;
- projection viewer identity input.

T1 data does not establish canonical source, target, tenure, task, role, ability-instance, effectiveness, or answer truth by itself.

### T2 — Canonical rebuilt state

The following are authoritative only after accepted-history validation:

- rebuilt `GameState`;
- setup role-catalog snapshot;
- roster and assignment;
- settlement-time `CurrentCharacterState`;
- unique active Dreamer tenure;
- scheduled task and progress;
- pre-event opportunity state;
- represented impairment state;
- current Demon identity;
- rebuilt first-night outcome ledger.

### T3 — Pure deterministic seams

The candidate may use bounded pure helpers for:

- exact canonical identifier formatting and parsing;
- normal-information resolution;
- deterministic false-role selection;
- stable code-unit comparisons.

T3 must remain a pure seam. It must not become a new shared unknown-context boundary, canonical-context platform, effect engine, or second state authority.

## Versioned Producer Transition

1. The accepted `dreamer-first-night-action-opportunity-v2` shape remains unchanged with `canChooseTarget=false` and `supportedDecisionKinds=[]`.
2. A new independently discriminated v3-style exact variant carries `canChooseTarget=true`, `supportedDecisionKinds=["CHOOSE_PLAYER"]`, `futureUnsupportedDecisionKinds=[]`, and the target schema required by the authorized scope.
3. The same canonical opportunity-ID grammar may be retained because accepted history permits exactly one generation for one task.
4. New V2-plan base Dreamer open commands produce only the new actionable variant after acceptance.
5. V1 and Slice 2B19A1 V2 histories remain replay-only and are not migrated.
6. Same-task mixed generations and duplicate openings fail closed.

## Normal Information and Effectiveness Boundary

Normal resolution is reachable only when canonical state proves all of the following:

- the source is the current base Dreamer;
- exactly one active Dreamer tenure binds the source and task revision;
- the canonical base ability instance is valid;
- settlement-time current character remains Dreamer;
- no represented `DRUNK` or `POISONED` impairment applies to the source;
- no current effective Vortox exists;
- no other known unresolved source-effect constraint applies.

If represented DRUNK or POISONED state exists, or a current Vortox exists, the application path must fail closed, retryably, without a receipt or event. If the current Demon is No Dashii and accepted state cannot prove that the base Dreamer is unaffected because adjacency poisoning is not modeled, the path must also fail closed. Missing, conflicting, or unprovable effectiveness evidence returns the separately designed dependency failure without consuming the command.

For the reachable normal path, the existing `dreamer-false-role-policy-v1` and `dreamer-information-model-v1` normal/effective policy can be reused. Candidate roles come only from the exact setup role-catalog snapshot. The target truth comes from settlement-time `CurrentCharacterState`. GOOD means Townsfolk or Outsider; EVIL means Minion or Demon, based on the role's native type rather than the player's current alignment. The deterministic simulator subset chooses the stable lowest legal opposite-alignment role ID by code-unit order, independent of catalog input order. Candidate shortage fails closed. This deterministic subset does not claim to be the only official Storyteller choice.

## Existing Infrastructure Sufficiency

- Existing domain-batch semantics can enforce target, delivery, and settlement order and atomicity.
- Existing first-night outcome-ledger variants can represent one normal fact without a new open generic evidence family.
- Existing private projection can consume historical delivery without a new projection system.
- Existing accepted replay and prospective-validation patterns can enforce state-before provenance.
- No new top-level `GameState` field, shared context platform, effect engine, event framework, projection framework, or infrastructure prerequisite is required.

## Recommended Production Scope

Recommended allowlist:

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/domain-core/src/dreamer.ts`
3. `packages/domain-core/src/domain-batch-semantics.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/application/src/game-application-service.ts`

`packages/domain-core/src/event-applier.ts` may be added only if the design proves that a typed replay adapter is necessary. It may not introduce a new replay authority.

Expected production files: `5`, at most `6` with the justified adapter.

Expected added production LOC: `1000-1450`.

## GO Conditions

| # | Condition | Result | Evidence |
|---|---|---|---|
| 1 | Slice 2B19A1 opportunity schema is not modified in place | PASS | New actionable exact variant; legacy V2 remains R2. |
| 2 | Actionable opportunity can be implemented as an independent version | PASS | Existing discriminated opportunity boundary supports a new exact generation. |
| 3 | V1 and Slice 2B19A1 histories can replay exactly | PASS | Producer transition does not migrate or reinterpret stored events. |
| 4 | Normal information can reuse the accepted V1 role-catalog policy | PASS | Reuse is limited to normal/effective behavior and exact current target truth. |
| 5 | No new shared infrastructure is required | PASS | Existing batch, ledger, projection, and replay surfaces are sufficient. |
| 6 | No new top-level `GameState` field is required | PASS | Required authority is already rebuilt from accepted history. |
| 7 | No more than 8 production files are expected | PASS | Recommended 5, at most 6 with one typed adapter. |
| 8 | Expected added production code is no more than 1,500 lines | PASS | Estimate is 1,000–1,450 lines. |
| 9 | Vortox and impairment information need not be implemented | PASS | Those paths remain retryable receipt-free fail-closed. |
| 10 | Gained Dreamer need not be implemented | PASS | Base-only source provenance is independently enforceable. |

## Stop-Loss

Return `RESLICE_REQUIRED` before implementation if design or implementation requires any of the following:

- a new open generic ledger-evidence family;
- a new top-level `GameState` field;
- a new canonical-context platform;
- a new effect engine;
- a new projection system;
- more than 10 production files;
- more than 2,000 added production lines;
- a second shared-infrastructure risk;
- implementation of any R4 behavior;
- an unresolved architecture blocker after two design rounds.

## Conclusion

All ten GO conditions pass. The candidate fits one controlled product Slice and may proceed to rule-delta evidence and independent design review. No production implementation is authorized until a complete design receives `RULE_DESIGN_PASS`.

GO
