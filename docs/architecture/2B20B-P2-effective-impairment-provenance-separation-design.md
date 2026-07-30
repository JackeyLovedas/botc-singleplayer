# Phase 3 Slice 2B20B-P2 — Effective Impairment Provenance Separation Design

## Metadata

- sliceId: `2B20B-P2`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2_DESIGN_PREPARATION_AND_GOVERNANCE`
- designStatus: `DRAFT_AWAITING_INDEPENDENT_RULE_DESIGN_REVIEW`
- ruleVerdict: `RULE_READY`
- designVerdict: `NOT_YET_REVIEWED`
- implementationAuthorized: `false`
- ruleSemanticsChanged: `false`
- eventSchemaChanged: `false`
- acceptedBehaviorChanged: `false`
- coverageTarget: `PARTIAL/GOVERNANCE_PREREQUISITE_ONLY`
- parentEvidence: `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`
- parentEvidenceSha256: `b3ee856f7eaf2d74d85b0b7f8265ccb2f677a64bb52919bbc35117e6fbec6994`
- currentArchitectureClassification: `A`
- requiredArchitectureChange: `true`
- requiredRuleChange: `false`
- requiredProductChange: `true (future bounded prerequisite only)`
- requiredNextAction: `INDEPENDENT_RULE_DESIGN_REVIEW`

This document is a design draft. It does not claim `RULE_DESIGN_PASS` and does not authorize implementation.

## Scope

Design one additive, producer-neutral read seam that derives a player's effective impairment conditions at an exact accepted-stream revision while returning impairment provenance separately. The seam evaluates those player-state conditions against one explicitly identified ability at that revision.

The seam must:

- represent `NONE`, `DRUNK`, `POISONED`, and simultaneous `DRUNK + POISONED`;
- state whether each condition is effective at the requested revision, its effective interval, and the evaluated ability it affects;
- distinguish player impairment state, evaluated ability identity, and condition provenance;
- derive results only from already validated accepted history;
- preserve current replay and hostile-input fail-closed behavior;
- introduce no persisted event or snapshot schema;
- remain unused by Dreamer settlement in this slice; and
- leave all accepted 2B20A and 2B20B-P1 behavior unchanged.

## Non-goals

This design does not authorize:

- POISONED Dreamer settlement or apparent-information delivery;
- No Dashii impairment derivation or resolution;
- Vigormortis kill, death, retained-Minion, adjacency, poison, or other-night behavior;
- a general `EffectInstance`, `ContinuousRule`, or impairment engine;
- changes to the Dreamer resolver;
- changes to application commands or `GameApplicationService`;
- new or changed domain events, payload versions, snapshots, receipts, or ledgers;
- changes to player or AI projections;
- changes to 2B20A or accepted 2B20B-P1 V8 behavior;
- replacement of existing replay validation; or
- first-night completion, day entry, nomination, voting, execution, death, or Phase 2C.

## Rule Authority

Primary evidence is `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`.

| Authority | Revision | SHA-256 |
|---|---|---|
| Official States | https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039 | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Rules Explanation | https://wiki.bloodontheclocktower.com/index.php?title=Rules_Explanation&oldid=1310 | `dcc318218842d92c908ec9382494f7001929e95e62474bcf62e04cd383d91189` |
| Official Vigormortis | https://wiki.bloodontheclocktower.com/index.php?title=Vigormortis&oldid=3015 | `9f0eef75059ccf4b9dea02aac7daa4b102920e0860cfdb1d055c569141597a6f` |
| Official Dreamer | https://wiki.bloodontheclocktower.com/index.php?title=Dreamer&oldid=2904 | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Chinese Wiki 醉酒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%86%89%E9%85%92&oldid=5720 | `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e` |
| Chinese Wiki 中毒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E4%B8%AD%E6%AF%92&oldid=6294 | `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0` |
| Chinese Wiki 亡骨魔 | https://clocktower-wiki.gstonegames.com/index.php?title=%E4%BA%A1%E9%AA%A8%E9%AD%94&oldid=6134 | `9520bd0c20fc21a274ac6450e7bb2490ce6ee34bb53e8880e035185ac836d275` |
| Chinese Wiki 筑梦师 | https://clocktower-wiki.gstonegames.com/index.php?title=%E7%AD%91%E6%A2%A6%E5%B8%88&oldid=3046 | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |
| Official nightsheet | botc-release commit `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

Rule conclusions:

- DRUNK and POISONED are effective player conditions, not producer identities.
- External rules do not require every effective condition to expose a full machine-queryable source chain.
- Both conditions may apply simultaneously.
- Vigormortis poison requires source-dependent lifecycle facts, but rules do not prescribe event, tenure, or ability-instance identifiers.
- Exact provenance, trusted replay validation, and hostile-input rejection are simulator audit/security contracts.
- Condition source and impairment status remain hidden from players and AI.

## Current Model Gap

The current model is classification `A`: downstream impairment recognition is coupled to a closed producer-specific history union.

- `philosopher-ability.ts` and `snake-charmer.ts` define the current closed `AbilityImpairmentSet`.
- Supported variants embed Philosopher duplicate-role DRUNK or Snake Charmer Demon-hit POISONED producer chains.
- `dreamer.ts` recognizes impairment by matching source-specific markers to current tenure.
- `first-night-action-opportunity.ts` uses `sourceAbilityInstanceId` for Dreamer execution identity, not impairment source.
- `event-applier.ts`, `rebuild.ts`, and `domain-batch-semantics.ts` preserve accepted-history validation but provide no producer-neutral effective-condition read model.
- `09-effect-lifecycle.md` describes the broader separation of effect source, lifecycle, target, visibility, and derived condition.
- `08-night-task-model.md` classifies No Dashii and Vigormortis as continuous rules, not scheduled actions.

Missing seam:

```text
validated accepted history
    → active player-condition facts at exact revision
    → condition effectiveness for an identified evaluated ability
    + separate provenance references
```

Current coupling:

```text
producer-specific impairment marker
    → downstream ability effectiveness
```

This slice adds only the read seam. Dreamer does not consume it.

## TypeScript Design Contract

Proposed module: `packages/domain-core/src/effective-impairment-provenance.ts`.

```ts
export const EFFECTIVE_CONDITIONS = [
  "DRUNK",
  "POISONED",
] as const;

export type EffectiveCondition =
  (typeof EFFECTIVE_CONDITIONS)[number];

export type EffectiveConditionState =
  | {
      readonly kind: "NONE";
      readonly conditions: readonly [];
    }
  | {
      readonly kind: "IMPAIRED";
      readonly conditions:
        | readonly ["DRUNK"]
        | readonly ["POISONED"]
        | readonly ["DRUNK", "POISONED"];
    };

export type EvaluatedAbilityIdentity = {
  readonly evaluatedPlayerId: string;
  readonly evaluatedRoleId: string;
  readonly evaluatedRoleTenureId: string;
  readonly evaluatedAbilityInstanceId: string;
};

export type AbilitySourceConditionProvenance = {
  readonly kind: "ABILITY_SOURCE";
  readonly sourcePlayerId: string;
  readonly sourceRoleId: string;
  readonly sourceRoleTenureId: string;
  readonly sourceAbilityInstanceId: string;
  readonly establishingEventId: string;
};

export type RoleEffectConditionProvenance = {
  readonly kind: "ROLE_EFFECT";
  readonly sourcePlayerId: string;
  readonly sourceRoleId: string;
  readonly sourceRoleTenureId: string;
  readonly sourceEffectReferenceId: string;
  readonly establishingEventId: string;
};

export type UnknownSourceConditionProvenance = {
  readonly kind: "UNKNOWN_SOURCE";
  readonly trustedBoundary:
    | "ACCEPTED_CANONICAL_HISTORY"
    | "APPROVED_CANONICAL_IMPORT";
  readonly establishingRecordId: string;
  readonly reason: "LEGACY_SOURCE_NOT_RETAINED";
};

export type ConditionProvenance =
  | AbilitySourceConditionProvenance
  | RoleEffectConditionProvenance
  | UnknownSourceConditionProvenance;

export type EffectiveConditionEvaluation = {
  readonly condition: EffectiveCondition;
  readonly isEffectiveAtRevision: true;
  readonly effectiveFromRevision: number;
  readonly effectiveUntilRevisionExclusive: number | null;
  readonly evaluatedAbility: EvaluatedAbilityIdentity;
  readonly provenance: ConditionProvenance;
};

export type EffectiveConditionSnapshot = {
  readonly revision: number;
  readonly evaluatedAbility: EvaluatedAbilityIdentity;
  readonly state: EffectiveConditionState;
  readonly effectiveConditions:
    readonly EffectiveConditionEvaluation[];
};

export type EffectiveConditionResolutionInput = {
  readonly acceptedEventStream: readonly unknown[];
  readonly revision: number;
  readonly evaluatedAbility: EvaluatedAbilityIdentity;
};

export type EffectiveConditionResolutionFailureCode =
  | "INVALID_EVALUATED_ABILITY_IDENTITY"
  | "INVALID_REVISION"
  | "REVISION_OUT_OF_RANGE"
  | "UNTRUSTED_EVENT_STREAM"
  | "UNSUPPORTED_IMPAIRMENT_VARIANT"
  | "SOURCE_REFERENCE_MISMATCH"
  | "EVALUATED_ABILITY_REFERENCE_MISMATCH"
  | "INVALID_LIFECYCLE_INTERVAL"
  | "CONFLICTING_CANONICAL_FACTS"
  | "UNAUTHORIZED_UNKNOWN_SOURCE"
  | "NON_CANONICAL_CONDITION_ORDER";

export type EffectiveConditionResolution =
  | {
      readonly ok: true;
      readonly snapshot: EffectiveConditionSnapshot;
    }
  | {
      readonly ok: false;
      readonly code: EffectiveConditionResolutionFailureCode;
    };

export function resolveEffectiveConditionsAtRevision(
  input: EffectiveConditionResolutionInput,
): EffectiveConditionResolution;
```

### Player state versus evaluated ability

DRUNK and POISONED are player conditions. Their onset, end, and provenance belong to the affected player's canonical history. `EvaluatedAbilityIdentity` identifies only the ability whose effectiveness is being evaluated at the requested revision.

The resolver must verify that the evaluated player, role, role tenure, and ability instance are canonical at that revision. It then attaches that identity to every returned `EffectiveConditionEvaluation` to state which ability is affected. The identity:

- does not create or end impairment;
- is not impairment provenance;
- cannot replace an impairment source ability/effect reference;
- may change after a character or tenure change while the player-state condition remains active; and
- must never be inferred from the impairment producer.

### Canonical condition ordering

Only these tuples are canonical:

```ts
[];
["DRUNK"];
["POISONED"];
["DRUNK", "POISONED"];
```

`["POISONED", "DRUNK"]`, duplicates, sparse arrays, symbols, accessors, non-plain objects, cycles, or extra values are non-canonical.

`effectiveConditions` must contain only evaluations effective at the requested revision. It uses stable ordering: `DRUNK` before `POISONED`, then `effectiveFromRevision`, then accepted-stream ordinal. Multiple source records for one condition remain separate; `state.conditions` contains unique conditions.

No canonical identity or ordering may use `Date.now`, randomness, UUID generation, `localeCompare`, `Intl.Collator`, or environment locale.

## Trust Boundary

### Accepted canonical history

The input stream is `readonly unknown[]` so TypeScript casts cannot bypass runtime validation. The resolver must invoke existing accepted-domain-event-stream and batch-semantics validation before deriving conditions. It may map only impairment facts accepted by those validators.

Existing validated Philosopher and Snake Charmer impairment facts may be represented by the producer-neutral output. This mapping does not authorize POISONED Dreamer or any other downstream behavior.

### UNKNOWN_SOURCE

`UNKNOWN_SOURCE` is representable but has no new producer in this slice. It may be emitted only when an already approved canonical import adapter has validated the import, established the condition independently of caller assertions, supplied a stable record identity, and classified missing source data as a retained legacy limitation.

No such adapter is authorized here. Raw events, snapshots, plain objects, booleans, or shape-valid fixtures cannot create `UNKNOWN_SOURCE`. If approved provenance cannot be established, return `UNAUTHORIZED_UNKNOWN_SOURCE` or `UNSUPPORTED_IMPAIRMENT_VARIANT`; do not infer health and do not invent provenance.

### Hostile replay

Fail closed without an uncaught exception for throwing/revoked proxies, getters/setters, symbols, sparse arrays, cycles, non-plain objects, missing/extra fields, duplicate/reordered terminal events, broken source links, invalid lifecycle intervals, unknown versions, or condition facts established after the requested revision. Getter invocation count remains zero where existing descriptor-safe validation promises it.

### No new persistence authority

All types in this design are derived read-model values. They are not domain events, stored payloads, snapshot fields, commands, receipts, ledgers, or projections.

## C19 Redesign

Existing P1-C19 remains unchanged with `MechanismMatch=FAIL`.

- `P2-C19A_EFFECTIVE_CONDITION_SET`: canonical NONE, DRUNK, POISONED, and DRUNK+POISONED.
- `P2-C19B_EVALUATED_ABILITY_IDENTITY`: every effective condition explicitly identifies the canonical ability affected at the requested revision without treating it as provenance.
- `P2-C19C_PROVENANCE_SEPARATION`: condition source remains separate from evaluated ability identity.
- `P2-C19D_TRUSTED_SOURCE_BOUNDARY`: only validated accepted history or an approved canonical import establishes provenance.
- `P2-C19E_HOSTILE_REPLAY_REJECTION`: forged, missing, unknown, or structurally hostile evidence fails closed.

No criterion claims POISONED Dreamer settlement.

## C20 Redesign

Existing P1-C20 remains unchanged with `MechanismMatch=FAIL`.

- `P2-C20A_NO_DASHII_SCOPE_GUARD`: no No Dashii producer or lifecycle derivation is added.
- `P2-C20B_NO_DOWNSTREAM_DREAMER_ADOPTION`: Dreamer opportunity, resolver, delivery, settlement, ledger, receipt, and projection paths do not consume the seam.

`SUP-2B20B-P1-011` is `FALSE_SCOPE_AUTHORITY`. It supports only actual No Dashii unresolved behavior and cannot establish POISONED Dreamer, general poison, Vigormortis poison, or producer-neutral condition authority.

## Design-time Governance Traceability V1.1

This table has exactly nine design-time fields and no `ActualTest` field.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| P2-C19A_EFFECTIVE_CONDITION_SET | DRUNK and POISONED are independent player conditions and may coexist | Pure seam returns canonical NONE, DRUNK, POISONED, and DRUNK+POISONED states | PURE_POLICY_SEAM | R1 | T2 | PURE_POLICY_SEAM | Four canonical combinations pass; duplicate or non-canonical order fails | Official States and Rules Explanation; no P1 SUP |
| P2-C19B_EVALUATED_ABILITY_IDENTITY | An active player impairment affects a specific canonical ability at a revision | Snapshot and every evaluation contain matching player, role, tenure, and ability-instance identity verified at the requested revision | STRUCTURAL_VALIDATION | R1 | T2 | STRUCTURAL_VALIDATION | Canonical identity passes; stale, cross-player, cross-tenure, or forged identity fails | 2B20B-P2 evidence and accepted role-tenure authority |
| P2-C19C_PROVENANCE_SEPARATION | Evaluated ability and impairment source are distinct identities | No evaluated ability field is used as source provenance and no provenance field establishes evaluated ability identity | STRUCTURAL_VALIDATION | R1 | T2 | STRUCTURAL_VALIDATION | Identity domains remain separate | 2B20B-P2 evidence and 09-effect-lifecycle |
| P2-C19D_TRUSTED_SOURCE_BOUNDARY | Provenance may be stricter than tabletop rules but cannot trust caller assertions | Only validated accepted history or separately approved canonical import establishes a condition | ACCEPTED_STREAM_INTEGRATION | R2 | T1 | ACCEPTED_STREAM_INTEGRATION | Valid existing producer facts resolve; unauthorized source fails | USER_OVERRIDES and existing replay authority; no No Dashii SUP |
| P2-C19E_HOSTILE_REPLAY_REJECTION | Untrusted history fails closed | Proxy, accessor, symbol, sparse, cycle, nonplain, unknown variant, cross-link mismatch, and invalid interval return declared failure | HOSTILE_REPLAY_REJECTION | R3 | T1 | HOSTILE_REPLAY_REJECTION | All hostile cases rejected; protected getters invoked zero times | Existing domain stream and batch validation authority |
| P2-C20A_NO_DASHII_SCOPE_GUARD | No Dashii remains unresolved and outside this prerequisite | No No Dashii producer, lifecycle derivation, or success path is added | CROSS_PLATFORM_CI | R4 | T3 | CROSS_PLATFORM_CI | Existing No Dashii unresolved behavior remains unchanged | `SUP-2B20B-P1-011=FALSE_SCOPE_AUTHORITY` |
| P2-C20B_NO_DOWNSTREAM_DREAMER_ADOPTION | This prerequisite does not alter Dreamer behavior | No Dreamer/application/projection path imports or calls the seam | LEGACY_REPLAY_COMPATIBILITY | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | Existing V4-V8 and 2B20A/P1 behavior remains unchanged | Existing regression authority; no borrowed primary |

`R4` for P2-C20A records excluded reachability, not implemented No Dashii behavior.

## Future Implementation Allowlist

A later implementation authorization may change only:

- `packages/domain-core/src/effective-impairment-provenance.ts`;
- `packages/domain-core/src/effective-impairment-provenance.test.ts`;
- the narrow domain-core export surface only if needed to expose the seam to tests;
- `docs/implementation/phase-3-slice-2b20b-p2-test-traceability.md`;
- this slice's required governance/control documentation.

Any other production file requires a new design review.

Explicitly excluded:

- `dreamer.ts`;
- `first-night-action-opportunity.ts`;
- `event-applier.ts`;
- `rebuild.ts`;
- `domain-batch-semantics.ts`;
- application service files;
- projection files;
- event definitions and payload validators;
- 2B20A and accepted P1 production/test files except read-only regression execution.

The seam may import existing validation functions but must not modify their contracts.

## Compatibility and Migration

- additive derived read model only;
- no event, snapshot, command, projection, receipt, or ledger migration;
- existing impairment variants remain byte-for-byte unchanged;
- existing histories rebuild under current validators before the seam reads them;
- no invented provenance for legacy history;
- no Dreamer consumer until a separately reviewed adoption slice;
- removing the module restores exact prior product behavior because no accepted runtime path depends on it.

## Failure Modes

| Failure | Required response |
|---|---|
| Stream fails existing validation | `UNTRUSTED_EVENT_STREAM` |
| Revision invalid or out of range | `INVALID_REVISION` or `REVISION_OUT_OF_RANGE` |
| Evaluated player/role/tenure/ability identity invalid | `INVALID_EVALUATED_ABILITY_IDENTITY` |
| Evaluated identity does not match accepted history at revision | `EVALUATED_ABILITY_REFERENCE_MISMATCH` |
| Impairment variant unknown | `UNSUPPORTED_IMPAIRMENT_VARIANT` |
| Source cross-link invalid | `SOURCE_REFERENCE_MISMATCH` |
| Lifecycle interval impossible | `INVALID_LIFECYCLE_INTERVAL` |
| Canonical facts conflict | `CONFLICTING_CANONICAL_FACTS` |
| Raw or unapproved UNKNOWN_SOURCE | `UNAUTHORIZED_UNKNOWN_SOURCE` |
| Condition order or multiplicity invalid | `NON_CANONICAL_CONDITION_ORDER` |
| Hostile proxy/accessor/cycle/nonplain input | Fail closed without uncaught exception |
| New event/snapshot field required | Stop and `HUMAN_BLOCKED` |
| Dreamer consumption required | Stop and reslice |

## Acceptance Criteria

1. NONE, DRUNK, POISONED, and DRUNK+POISONED resolve canonically.
2. Each returned condition states `isEffectiveAtRevision`, its effective interval, and the evaluated ability identity.
3. Evaluated player, role, tenure, and ability instance are canonical at the requested revision.
4. Player impairment state remains independent of current evaluated ability identity.
5. Evaluated ability identity never substitutes for impairment provenance.
6. Multiple active provenance records do not erase one another.
7. Existing validated Philosopher and Snake Charmer histories map without event changes.
8. No POISONED Dreamer behavior becomes reachable.
9. No No Dashii or Vigormortis continuous effect is implemented.
10. UNKNOWN_SOURCE cannot be constructed from raw input.
11. Existing histories remain rebuildable and V4-V8 behavior remains unchanged.
12. Hostile proxies, getters, symbols, sparse arrays, cycles, and nonplain values fail closed.
13. No event, snapshot, command, application, projection, or Dreamer-resolver schema changes occur.
14. Typecheck, lint, targeted tests, ordinary tests, and approved coverage pass.
15. Traceability has one primary identity per criterion and no borrowed P1 primary.
16. Independent review returns the protocol-defined passing verdict before implementation.

## Stop Conditions

Stop without implementation if:

- review is not `RULE_DESIGN_PASS`;
- a rule conflict appears;
- a new event, payload, snapshot, or import format is required;
- canonical identity cannot be established without trusting caller assertions;
- a generic effect engine, No Dashii, full Vigormortis, or Dreamer adoption becomes necessary;
- accepted replay/projection behavior changes;
- hostile input cannot fail closed;
- the allowlist must expand; or
- tests or replay validation would need weakening.

## Tradeoff Decision

### Selected: minimal derived seam

One derived read seam separates player condition, evaluated ability identity, and provenance. It supports simultaneous conditions, creates no persistence authority, and makes no downstream behavior reachable.

### Deferred: full EffectInstance / ContinuousRule engine

The broader architecture remains appropriate for No Dashii, Vigormortis, dependency graphs, movement, recalculation, and Storyteller selection, but exceeds this prerequisite.

### Rejected: another producer-specific union variant

It would repeat condition/provenance coupling.

### Rejected: direct effective-state flag

A caller flag, snapshot field, or shape-only import marker would create untrusted authority and weaken replay provenance.

## Design Disposition

- ruleVerdict: `RULE_READY`
- designVerdict: `NOT_YET_REVIEWED`
- implementationAuthorized: `false`
- recommendedDisposition: `SUBMIT_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
- requiredPassingVerdictBeforeImplementation: `RULE_DESIGN_PASS`
- requiredNextAction: `INDEPENDENT_RULE_DESIGN_REVIEW`
