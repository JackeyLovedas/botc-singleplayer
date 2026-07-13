# Phase 3 Slice 2B18A — Ledger-Only Rescope

## Metadata

```yaml
sliceId: 2B18A
authorization: USER_AUTHORIZED_2B18A_LEDGER_ONLY_RESCOPE_AND_FINAL_REPAIR
scopeMode: LEDGER_ONLY_RESCOPE
behaviorDesignFrozen: true
previousScope: ledger + state-bound true-count resolver
acceptedNewScope: canonical derived first-night ability outcome ledger only
repairRound: 3 / 3
maxSlices: 1
ruleSemanticsChanged: false
approvedOverridesChanged: false
acceptedEventContractsChanged: false
coverageStatus: PARTIAL
parentDesign: docs/implementation/phase-3-slice-2b18a-design-round-3-2.md
parentRuleEvidence: docs/rules/evidence/2B18-resolved.md
priorReviewedProductHead: faf3b44714b62f7723ecb319e6d244a324215088
blockedDocsHeadAtRescope: 3e822ee004b5dc32dc6fe49383169b45805d03ea
pullRequest: 23
featureBranch: phase-3/first-night-ability-outcome-ledger
```

## 1. Authorization and authority

This rescope is authorized by:

`USER_AUTHORIZED_2B18A_LEDGER_ONLY_RESCOPE_AND_FINAL_REPAIR`

It is a reduction of implementation scope, not a change to BOTC rules, the four approved Mathematician simulator overrides, or the outcome classifications approved by Design 3.2.

Authority order for the repaired slice is:

1. `docs/rules/USER_OVERRIDES.md`;
2. `docs/rules/evidence/2B18-resolved.md`;
3. the fact-classification and terminal-adapter semantics in `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`;
4. this document for the final accepted 2B18A implementation boundary;
5. production code and tests only as implementation evidence, never as rule truth.

Where Design 3.2 describes a public Mathematician count resolver, count-result contracts, resolving context, override runtime carrier, count classification, own-instance exclusion, duplicate-holder counting, or numeric-domain execution, this document supersedes those sections for 2B18A by deferring them to 2B18B. All approved ledger fact classifications remain unchanged.

No additional external rule research is required for this scope reduction.

## 2. Accepted scope

2B18A accepts only the canonical derived first-night ability outcome ledger foundation:

- one replay-derived first-night ledger anchor;
- replay-derived terminal ability outcome facts;
- frozen `NORMAL`, `ABNORMAL`, `UNRESOLVED`, and `PENDING_TRIGGER` classifications;
- evidence references needed to explain and validate each supported terminal fact;
- canonical ability-instance and fact identifiers;
- deterministic evidence and fact ordering;
- exact structural validation;
- canonical-source validation at the replay integration boundary;
- base, Philosopher-gained V1, and Philosopher-gained V2 task provenance;
- supported terminal adapters;
- deterministic state rebuild;
- projection non-leakage;
- existing Mathematician fail-closed application behavior.

The ledger remains derived state. This slice adds no domain event for the ledger or its facts.

## 3. Deferred to 2B18B

The following are wholly deferred and are not partially accepted by 2B18A:

- canonical true-count resolver;
- `MathematicianCountResolution`;
- candidate number domain execution;
- source impairment output selection;
- Vortox final false number;
- Mathematician information delivery;
- private projection;
- task settlement.

2B18B must rebuild canonical state from a complete accepted event stream before evaluating a Mathematician count. It may not treat a caller-created `GameState` or caller-created ledger as proof of accepted history.

This deferral does not start 2B18B and does not authorize 2B19.

## 4. Contracts removed from 2B18A

The repair must delete from the 2B18A production implementation and domain-core package-root export surface:

- `resolveFirstNightMathematicianTrueCountFromState`;
- `MathematicianCountResolution`;
- `MathematicianCountResolved`;
- `MathematicianCountUnresolved`;
- `MathematicianCountDistinctPlayer`;
- `MathematicianCountUnresolvedFact`;
- `validateMathematicianCountResolution`;
- `cloneMathematicianCountResolution`;
- `FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION`;
- `CountCommon`;
- `validateMathematicianCountResolutionShape`;
- `FirstNightAbilityOutcomeWindowSnapshot`;
- `WINDOW_SNAPSHOT_KEYS`;
- `validateFirstNightAbilityOutcomeWindowSnapshot`;
- `validateFirstNightAbilityOutcomeWindowSnapshotShape`;
- `cloneFirstNightAbilityOutcomeWindowSnapshot`;
- `InternalResolvingMathematicianContext`;
- `InternalResolvingMathematicianRosterSnapshot`;
- `buildInternalResolvingMathematicianContext`;
- `APPLICABLE_MATHEMATICIAN_OVERRIDES`;
- `MathematicianAuditOverrideVersions`;
- `MATHEMATICIAN_AUDIT_OVERRIDE_SET_VERSION`;
- all resolver-only categorization, own-exclusion, player-deduplication, unresolved-redundancy, future-window, and count-result code.

If `InvalidResolvingMathematicianContext` and `InvalidMathematicianCountResolutionInput` were introduced only for the removed resolver family and have no retained ledger use, they must also be removed from the DomainError contract.

The four approved override records remain unchanged in `docs/rules/USER_OVERRIDES.md`. Removing the runtime carrier does not remove, alter, supersede, or reinterpret those records.

There must be no renamed replacement resolver and no public or internal decision API that accepts any of:

- caller-supplied `GameState`;
- caller-supplied ledger;
- caller-supplied resolving context;
- caller-supplied window;
- caller-supplied Mathematician source or instance;
- caller-supplied override carrier.

The application layer must not calculate or request a Mathematician count.

## 5. Retained public contract

The domain-core package root may expose only the following first-night outcome-ledger families.

### 5.1 Constants

- `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION`;
- `FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION`;
- `FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION`.

No count-resolution or override-carrier version is part of the 2B18A runtime API.

### 5.2 Types

- `OutcomeLedgerValidationResult`;
- `FirstNightAbilityInstanceId`;
- `FirstNightAbilityOutcomeFactId`;
- `FirstNightAbilityOutcomeWindowAnchor`;
- `FirstNightAbilityInstanceProvenance`;
- `TerminalAbilityOutcomeEventType`;
- the 16 closed evidence variants;
- `AbilityOutcomeEvidenceReference`;
- `AbilityOutcomeStatus`;
- `AbilityOutcomeCause`;
- `FirstNightAbilityOutcomeFact`;
- `FirstNightAbilityOutcomeLedger`.

### 5.3 Identifier functions

- `formatBaseFirstNightAbilityInstanceId`;
- `formatPhilosopherGainedV1AbilityInstanceId`;
- `formatPhilosopherGainedV2AbilityInstanceId`;
- `formatExplicitFirstNightAbilityInstanceId`;
- `parseFirstNightAbilityInstanceId`;
- `formatFirstNightAbilityOutcomeFactId`;
- `parseFirstNightAbilityOutcomeFactId`.

The gained-instance parser must distinguish `BASE`, `V1`, and `V2` by strict grammar. A shared `first-night-v[12]` acceptance branch is insufficient. The parser must expose enough parsed data to cross-check generation, task type, embedded seat, embedded role, and grant identity.

### 5.4 Clone functions

Clone helpers may be public for:

- window anchors;
- ability-instance provenance;
- evidence references;
- facts;
- ledgers.

Every clone must reject noncanonical runtime shapes and must not share nested references with its input.

### 5.5 Shape validators

Public structural validators must be named so that their limitation is explicit:

- `validateFirstNightAbilityOutcomeWindowAnchorShape`;
- `validateFirstNightAbilityInstanceProvenanceShape`;
- `validateAbilityOutcomeEvidenceReferenceShape`;
- `validateFirstNightAbilityOutcomeFactShape`;
- `validateFirstNightAbilityOutcomeLedgerShape`.

Retaining an old validator name is allowed only if that validator is removed from the package root and used as an internal structural helper.

`canonicalizeAbilityOutcomeEvidenceReferences` is an internal derivation helper and must not be advertised as proof of accepted history.

Shape validators are responsible only for:

- exact enumerable keys;
- canonical primitives;
- dense arrays;
- closed unions;
- canonical ID grammar;
- positive revisions and event sequences;
- valid enum members;
- deterministic ordering;
- duplicate-identity detection;
- internal equality and cross-field consistency that can be proved from the candidate object itself.

Shape validators do not prove that an event, task, grant, insertion, opportunity, roster entry, role tenure, impairment, delivery, or accepted history exists.

The following sentence must be added to `AGENTS.md`, `docs/agent-loop/REVIEW_PROTOCOL.md`, and the final 2B18A status:

> Shape validation is not accepted-history provenance.

## 6. Canonical provenance boundary

A ledger has canonical provenance only when it is produced by accepted event replay through `rebuildGameState`, `validateDomainEventStream`, and the `applyDomainEvent` replay path from a predecessor state that itself came from that accepted stream.

Calling a shape validator successfully does not grant canonical provenance.

Calling `applyDomainEvent` directly with an arbitrary caller-created predecessor state does not certify that predecessor’s history. The supported canonical path begins with the complete accepted stream.

The only canonical fact-creation path is:

```text
accepted terminal event envelope
+
validated pre-event canonical state
→
deriveFirstNightAbilityOutcomeFact
→
validateFactAgainstCanonicalSource
→
exact canonical equality
→
append to FirstNightAbilityOutcomeLedger
```

`deriveFirstNightAbilityOutcomeFact` and `validateFactAgainstCanonicalSource` remain domain-core internal functions and are not package-root exports.

`validateFactAgainstCanonicalSource` must accept only:

- the exact pre-event state;
- the exact accepted terminal envelope;
- the candidate derived fact.

It must independently re-derive the expected fact and require canonical semantic equality between the candidate and the expected value. It must not accept caller-supplied expected evidence, expected status, expected cause, expected source identity, or expected task provenance.

Before append, the integration boundary must:

1. shape-validate the existing ledger;
2. verify the ledger anchor against the canonical pre-event state;
3. validate the exact terminal event envelope;
4. derive the expected fact from the terminal pre-state;
5. validate the derived fact shape;
6. validate every canonical source cross-link;
7. require exact equality with the independently derived expected fact;
8. reject an existing equal or conflicting fact identity;
9. append in event-sequence order;
10. shape-validate the resulting ledger.

A repeated terminal event remains invalid under existing event-stream duplicate rules. It is not converted into a harmless duplicate ledger append.

Accepted event, payload, batch, command, receipt, settlement, and event-version contracts remain unchanged.

## 7. Anchor and roster binding

`FirstNightInitialized` creates exactly one empty ledger whose anchor contains:

- the exact event `gameId`;
- the exact event `rulesBaselineVersion`;
- `nightNumber: 1`;
- the exact initialization `eventId`;
- the exact initialization `eventSequence`;
- `startBoundary: "EXCLUSIVE"`.

Every derived fact must have a source sequence strictly greater than the anchor sequence.

At the canonical replay boundary:

- anchor `gameId` must equal state and event `gameId`;
- anchor baseline must equal state and event baseline;
- anchor event ID and sequence must equal the accepted `FirstNightInitialized` envelope represented by the rebuilt first-night state;
- one player maps to exactly one fixed roster seat;
- one fixed roster seat maps to exactly one player;
- every fact source player and seat must match the fixed roster;
- every target player and seat in evidence must match the fixed roster;
- every `PLAYER_ROLE_AT_REVISION` player and seat must match the fixed roster;
- a later character-state change must not rewrite an earlier fact.

A standalone caller-created ledger cannot be certified by supplying a self-consistent anchor or roster-shaped object.

## 8. Canonical task and ability-instance provenance

Every derived fact must bind its `abilityTaskId`, `abilityRoleId`, source player, source seat, ability-instance provenance, terminal source record, and accepted task plan.

Expected inserted tasks must never be reconstructed by filtering the plan’s own `PHILOSOPHER_GAINED_ABILITY` tasks. That is circular self-certification.

The canonical reconstruction algorithm is:

1. read actual insertion facts from `state.firstNightTaskInsertions`;
2. require an exact object shape and a dense `insertions` array;
3. reject duplicate insertion identities and conflicting task identities;
4. validate every insertion using the existing generation-specific validator:
   - `validateFirstNightTaskInsertedPayload`, or
   - `validateFirstNightTaskInsertedV2Payload`;
5. reconstruct each expected scheduled task with `scheduledTaskFromFirstNightTaskInsertedPayload`;
6. pass only those reconstructed expected tasks to `validateFirstNightTaskPlanRuntimeState`;
7. compare the reconstructed tasks exactly with the runtime inserted tasks in the plan;
8. reject any runtime gained task without one accepted insertion fact;
9. reject any accepted insertion that does not map to exactly one runtime task.

### 8.1 Base role task

A base-role fact must prove:

- task source kind is `ROLE`;
- the role snapshot is exactly the accepted Mathematician or supported terminal-role catalog snapshot, as applicable;
- the task ID is the canonical base task ID;
- task player and seat match roster and the terminal pre-state character source;
- task role matches `abilityRoleId`;
- no Philosopher grant is attached;
- no insertion is attached;
- the task ID is unique in the plan;
- the terminal event references the same task and source opportunity where applicable.

A base ability-instance ID must parse only as `BASE`, never V1 or V2.

### 8.2 Philosopher-gained V1

A V1 gained fact must prove:

- plan version is `first-night-task-plan-v1`;
- task ID is strictly a V1 `PHILOSOPHER_GAINED` task ID;
- ability-instance kind is `PHILOSOPHER_GAINED_TASK_V1`;
- insertion generation is `V1`;
- the V1 insertion payload passes its exact accepted validator;
- exactly one accepted V1 insertion reconstructs the task;
- exactly one accepted Philosopher grant exists;
- exactly one accepted Philosopher opportunity exists;
- task, insertion, grant, and opportunity agree on player, seat, chosen role, task, opportunity, and source character-state revision;
- grant embedded role is `mathematician` or the exact terminal ability role being represented;
- task `from-<role>` equals grant `from-<role>`;
- both equal insertion `chosenRoleId`;
- all equal `abilityRoleId`;
- V2 `schedulingVersion`, V2-only grant linkage, and V2 task grammar are absent.

### 8.3 Philosopher-gained V2

A V2 gained fact must prove:

- plan version is `first-night-task-plan-v2`;
- task ID is strictly a V2 `PHILOSOPHER_GAINED` task ID;
- ability-instance kind is `PHILOSOPHER_GAINED_TASK_V2`;
- insertion generation is `V2`;
- scheduling version is exactly the accepted Philosopher gained first-night V2 scheduling version;
- insertion `grantId` equals the unique accepted grant;
- task catalog version, task signature, base order, task class, and settlement policy match the accepted V2 insertion and catalog;
- exactly one accepted V2 insertion reconstructs the task;
- exactly one accepted grant and one accepted opportunity form the same chain;
- task, insertion, grant, and opportunity agree on player, seat, chosen role, task, opportunity, and source revision;
- task `from-<role>` equals grant `from-<role>`;
- both equal insertion `chosenRoleId`;
- all equal `abilityRoleId`;
- all V1-only grammar and V1 insertion shapes are absent.

### 8.4 Generation and identity mixing

The implementation must reject every mixed chain, including:

- V1 provenance with a V2 task ID;
- V2 provenance with a V1 task ID;
- V1 plan with a V2 insertion;
- V2 plan with a V1 insertion;
- task embedded seat differing from the source seat;
- task embedded role differing from grant embedded role;
- grant embedded role differing from chosen role;
- chosen role differing from `abilityRoleId`;
- provenance generation differing from task, plan, or insertion generation;
- a forged runtime inserted task with no accepted insertion fact;
- missing or duplicate grant, insertion, or opportunity records.

## 9. Retained fact and evidence semantics

The 16 evidence variants, their exact shapes, primary identities, canonical ordering, and terminal minimum evidence sets remain those approved by Design 3.2.

Primary identities remain:

- `SOURCE_EVENT`: terminal event ID;
- `TASK`: task ID;
- `ACTION_OPPORTUNITY`: opportunity ID;
- `ABILITY_IMPAIRMENT`: impairment ID;
- `ROLE_TENURE`: tenure ID;
- `CHARACTER_STATE`: character-state revision;
- `PLAYER_ROLE_AT_REVISION`: compound identity `(playerId, characterStateRevision)`;
- `PHILOSOPHER_GRANT`: grant ID;
- `FIRST_NIGHT_TASK_INSERTION`: task ID plus generation;
- `SNAKE_CHARMER_RESOLUTION`: terminal resolution event ID;
- `EVIL_TWIN_PAIR`: pair ID;
- `WITCH_PENDING_MARKER`: pending-death ID;
- `CERENOVUS_INSTRUCTION`: delivery ID;
- `CLOCKMAKER_DELIVERY`: delivery ID;
- `DREAMER_DELIVERY`: terminal event ID;
- `SEAMSTRESS_DELIVERY`: terminal event ID.

Equal evidence with the same kind and primary identity is deduplicated. Conflicting content with the same kind and primary identity fails closed. Ordering uses fixed kind rank, numeric order for numbers, and code-unit string order. It must not use locale-sensitive comparison or input insertion order.

Every terminal fact must contain the exact minimum and conditional evidence set from Design 3.2. A gained instance additionally requires matching `PHILOSOPHER_GRANT` and `FIRST_NIGHT_TASK_INSERTION`. An explicit domain instance additionally requires matching source `ROLE_TENURE`.

No evidence reference may be invented for a missing historical record. A rule-permitted lack of evidence produces the approved `UNRESOLVED` classification only where Design 3.2 explicitly permits it.

## 10. Frozen terminal classifications

The repair may strengthen canonical source validation but must not change the following behavior.

### 10.1 Philosopher

- `PhilosopherActionDeferred` produces `NORMAL / NO_OTHER_CHARACTER_ABILITY`.
- `PhilosopherAbilityGranted` produces `NORMAL / NO_OTHER_CHARACTER_ABILITY`.
- A duplicate-role drunkenness marker is not itself an additional outcome fact.

### 10.2 Snake Charmer

The terminal pre-event historical target role controls classification:

- effective non-Demon no-swap: `NORMAL`;
- effective Demon swap: `NORMAL`;
- impaired non-Demon no-swap: `NORMAL`;
- impaired Demon no-swap: `ABNORMAL`, with cause matching the proven impairment;
- target historical role not provable: `UNRESOLVED / CAUSE_NOT_PROVEN`.

A later role change must not affect the stored fact.

### 10.3 Evil Twin

Supported first-night information delivery produces the frozen Design 3.2 classification and must bind the accepted pair, source, target, task, and terminal event. Later Evil Twin lifecycle is outside this slice.

### 10.4 Witch

- `WitchDeathPendingMarked`: `NORMAL / NO_OTHER_CHARACTER_ABILITY`;
- `WitchIneffectiveResolved`: `PENDING_TRIGGER`, with the proven drunkenness or poisoning cause;
- later nomination or death does not rewrite the fact;
- settlement does not create a duplicate fact.

### 10.5 Cerenovus

- intermediate choice or madness marker creation produces no fact;
- supported effective instruction delivery produces `NORMAL`;
- an impaired path with no accepted terminal instruction event produces no fact.

Canonical validation must bind the unique chain:

```text
choice → marker → instruction delivery
```

The chain must agree on:

- delivery ID;
- choice ID;
- marker ID;
- task ID;
- opportunity ID;
- source player and seat;
- target player and seat;
- chosen role;
- source character-state revision;
- source role tenure where required;
- terminal event ID.

Checking only that a choice ID exists is insufficient.

### 10.6 Clockmaker

If `selectedDistance === ruleCorrectDistance`:

- classification is `NORMAL`;
- cause is `NO_OTHER_CHARACTER_ABILITY`.

If the values differ:

- proven `DRUNK` source impairment produces `ABNORMAL / SOURCE_DRUNKENNESS`;
- proven `POISONED` source impairment produces `ABNORMAL / SOURCE_POISONING`;
- proven Vortox constraint produces `ABNORMAL / VORTOX_FALSE_INFORMATION`;
- a permitted but unprovable cause produces the frozen Design 3.2 unresolved result.

An impairment cause requires a matching canonical impairment record with the same affected player, seat, role, revision, and impairment kind. A Vortox cause requires the matching historical Vortox player, seat, tenure, revision, and recorded constraint.

### 10.7 Dreamer

When represented impairment exists:

- `informationReliability.sourceImpairmentKind` must equal the canonical impairment kind;
- impairment ID must match;
- source player, seat, role, and revision must match.

A delivered pair containing the target’s historical true role remains `NORMAL`, including when the Dreamer is impaired.

A pair not containing the target’s historical true role is `ABNORMAL` only when a matching `DRUNK` or `POISONED` record proves the cause.

The Vortox matrix remains:

- effective Vortox proven: `UNRESOLVED / DREAMER_VORTOX_CONSTRAINT_UNRECORDED`;
- Vortox applicability unresolved: `UNRESOLVED / VORTOX_APPLICABILITY_NOT_PROVEN`;
- no effective Vortox proven plus effective normal pair: `NORMAL`;
- no effective Vortox proven plus impaired normal pair: `NORMAL`;
- no effective Vortox proven plus impaired abnormal pair: `ABNORMAL`;
- no effective Vortox proven plus effective abnormal pair: invalid accepted-history invariant.

Dreamer and Seamstress use their terminal event IDs; no synthetic delivery ID may be invented.

### 10.8 Seamstress

If `deliveredAnswer === ruleCorrectAnswer`:

- classification is `NORMAL`;
- represented impairment does not change that result.

If the answers differ:

- proven `DRUNK` source impairment produces `ABNORMAL / SOURCE_DRUNKENNESS`;
- proven `POISONED` source impairment produces `ABNORMAL / SOURCE_POISONING`;
- proven Vortox constraint produces `ABNORMAL / VORTOX_FALSE_INFORMATION`;
- a permitted but unprovable cause produces the frozen Design 3.2 unresolved result.

A mismatch cannot claim impairment or Vortox without the corresponding accepted evidence chain.

### 10.9 Mathematician

No Mathematician information-delivery fact is produced in 2B18A.

`MATHEMATICIAN_INFORMATION` continues to fail closed with:

- `ApplicationNotConfigured`;
- `retryable = true`;
- no receipt;
- no domain events;
- no task settlement;
- no game-version increment.

## 11. Replay determinism and projection boundary

The same accepted event stream must rebuild the same anchor, facts, evidence order, IDs, and ledger on Windows and Ubuntu.

Equivalent evidence arriving in a different object-key or input order must canonicalize to the same fact.

The implementation must not use:

- `localeCompare`;
- `Intl.Collator`;
- `Math.random`;
- `Date.now` for canonical identity;
- random UUIDs;
- raw `JSON.stringify` semantic comparison;
- `Array.prototype.every` as a sparse-array detector.

The ledger, facts, evidence, and window must not enter:

- player private projections;
- AI projections;
- public projections;
- Mathematician private count output.

No private Mathematician count output exists in this slice.

## 12. Required direct tests

The repaired suite must retain all main-branch tests and all PR tests that prove ledger derivation, replay, role classification, projection non-leakage, and V1/V2 task ordering.

Only tests whose sole purpose is the removed public resolver or count-result family may be deleted. They must be replaced with scope-boundary tests.

### 12.1 Base and gained provenance

Directly test:

1. accepted base Mathematician task chain;
2. accepted Philosopher-gained V1 chain;
3. accepted Philosopher-gained V2 chain;
4. V1 provenance with V2 task ID is rejected;
5. V2 provenance with V1 task ID is rejected;
6. V1 plan with V2 insertion is rejected;
7. V2 plan with V1 insertion is rejected;
8. task role segment differing from grant role segment is rejected;
9. task role segment differing from `abilityRoleId` is rejected;
10. grant role segment differing from chosen role is rejected;
11. source seat differing from embedded task seat is rejected;
12. missing insertion is rejected;
13. duplicate insertion is rejected;
14. missing grant is rejected;
15. duplicate grant is rejected;
16. missing opportunity is rejected;
17. mismatched opportunity task is rejected;
18. tampered catalog signature, order, class, or settlement policy is rejected;
19. a plan-created inserted task with no insertion fact is rejected.

### 12.2 Canonical replay ledger

Directly test:

20. `FirstNightInitialized` establishes the exact anchor;
21. altered anchor event ID is rejected at canonical replay validation;
22. altered anchor sequence is rejected;
23. a fact at or before the exclusive anchor is rejected;
24. source player absent from roster is rejected;
25. source seat inconsistent with roster is rejected;
26. target seat inconsistent with roster is rejected;
27. equivalent streams produce identical ledgers on Windows and Ubuntu;
28. different object-key insertion order produces an identical canonical ledger;
29. later character-state changes do not rewrite earlier facts.

### 12.3 Role semantics

Directly test:

30. Clockmaker mismatch with matching `DRUNK` evidence;
31. Clockmaker mismatch without impairment evidence is rejected;
32. Clockmaker impairment-kind mismatch is rejected;
33. Clockmaker Vortox chain;
34. Dreamer impairment-kind match;
35. Dreamer impairment-kind mismatch is rejected;
36. Dreamer normal pair remains `NORMAL`;
37. Dreamer proven Vortox remains `UNRESOLVED`;
38. Seamstress mismatch with matching `DRUNK` evidence;
39. Seamstress mismatch without impairment evidence is rejected;
40. Seamstress Vortox chain;
41. complete Cerenovus choice-marker-delivery chain;
42. Cerenovus choice-ID mismatch is rejected;
43. Cerenovus marker-ID mismatch is rejected;
44. Cerenovus chosen-role mismatch is rejected;
45. Cerenovus target mismatch is rejected;
46. impaired Snake Charmer targeting a historical non-Demon remains `NORMAL`;
47. impaired Snake Charmer targeting a historical Demon is `ABNORMAL`;
48. insufficient historical Snake Charmer target truth is `UNRESOLVED`.

### 12.4 Scope boundary

Directly test:

49. package root has no public true-count resolver;
50. package root has no `MathematicianCountResolution` validator or clone;
51. arbitrary `GameState` cannot obtain a Mathematician count through any public API;
52. arbitrary ledger cannot obtain a Mathematician count through any public API;
53. `MATHEMATICIAN_INFORMATION` remains fail closed;
54. no `MathematicianInformationDelivered` event is emitted;
55. no Mathematician task settlement occurs;
56. the ledger does not enter player projection;
57. the ledger does not enter AI projection;
58. all pre-existing main tests remain present and green;
59. exact-head Windows and Ubuntu CI agree.

### 12.5 Shape and hostile-input coverage

Retained public shape validators and clone helpers must directly reject:

- missing and extra keys;
- sparse arrays;
- proxy, accessor, cyclic, symbol-keyed, and non-plain objects;
- invalid primitive and enum values;
- noncanonical or generation-mixed IDs;
- duplicate evidence identity with conflicting content;
- invalid evidence sort order;
- fact identity inconsistent with its source event;
- ledger fact order inconsistent with source event sequence.

Tests must describe these as structural guarantees, not accepted-history proof.

## 13. Documentation and claim corrections

The PR body must retain the required sections:

- `Rule Evidence`;
- `Rule Claims Implemented`;
- `Explicitly Unsupported Rules`;
- `Rule Source Revisions`;
- `Rule-to-Test Traceability`.

It must remove or rewrite claims that 2B18A completed:

- a state-bound true-count resolver;
- exact ledger-bound count validation;
- hostile caller-supplied state closure for a count API;
- canonical provenance proof by standalone validators;
- Mathematician count classification;
- private information selection or delivery;
- Mathematician task settlement.

Accurate accepted claims are limited to:

- derived first-night ability outcome ledger;
- canonical terminal replay derivation;
- exact terminal fact equality;
- accepted base/V1/V2 ability-source provenance;
- role-specific historical outcome classification for supported adapters;
- deterministic evidence/fact ordering;
- shape validation explicitly distinguished from accepted-history provenance;
- projection non-leakage;
- Mathematician information remains unimplemented and fail closed;
- true-count resolver deferred to 2B18B;
- coverage remains `PARTIAL`.

`docs/rules/ROLE_COVERAGE_MATRIX.md` must not claim:

- Mathematician true-count resolution;
- canonical count result;
- private Mathematician information;
- information delivery;
- task settlement.

It may claim only:

- first-night audit ledger foundation;
- specifically supported terminal role adapters;
- no public count decision API;
- no number delivery;
- no settlement;
- `PARTIAL` or `SKELETON`, never `COMPLETE`.

## 14. Autopilot state and history

After `SCOPE_REVIEW_PASS`, control state must record:

```yaml
repairRound: 3
maxRepairRounds: 3
status: RUNNING
implementationAuthorized: true
scopeMode: LEDGER_ONLY_RESCOPE
behaviorDesignFrozen: true
rescopeAuthorization: USER_AUTHORIZED_2B18A_LEDGER_ONLY_RESCOPE_AND_FINAL_REPAIR
priorReviewedProductHead: faf3b44714b62f7723ecb319e6d244a324215088
blockedDocsHeadAtRescope: 3e822ee004b5dc32dc6fe49383169b45805d03ea
```

The three prior final-review reports and all historical commits remain immutable.

State and status documentation must record that the previous six blockers were:

1. incomplete canonical insertion/task/grant/opportunity chain;
2. incomplete V1/V2 generation and role-segment binding;
3. caller-supplied state/ledger accepted-history provenance gap;
4. incomplete Clockmaker, Dreamer, Seamstress, Cerenovus, and impairment cross-links;
5. incomplete count-result recomputation;
6. missing adversarial regressions and overstated PR/matrix claims.

The rescope disposes of blockers 3 and 5 by removing the unaccepted count decision API and result contract from 2B18A. It does not waive the ledger provenance work underlying blockers 1, 2, 4, and 6.

## 15. Scope-review gate

Before production code changes, an independent read-only reviewer must return exactly one of:

- `SCOPE_REVIEW_PASS`;
- `SCOPE_REVIEW_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

`SCOPE_REVIEW_PASS` requires confirmation that:

- this is scope reduction, not rule modification;
- Design 3.2 ledger classifications remain frozen;
- the public count resolver is deferred rather than incorrectly implemented;
- all code selected for removal was introduced by unaccepted PR #23 work;
- no main-branch production contract or test is removed;
- `MATHEMATICIAN_INFORMATION` remains fail closed;
- the four approved overrides remain unchanged;
- 2B18B and 2B19 remain unstarted;
- this document removes all caller-supplied state/ledger decision APIs while retaining canonical replay-derived ledger behavior.

No production edit is authorized without `SCOPE_REVIEW_PASS`.

## 16. Implementation, review, and merge gates

After scope approval, the sole writer performs repair round 3 on the existing branch and PR only.

Required local gates are:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
git diff --check
```

The frozen feature HEAD must have successful push and pull-request CI for the exact same SHA on Windows and Ubuntu.

A fresh independent final reviewer must confirm:

- the public resolver and complete count-result family are absent;
- no alternative caller-supplied state, ledger, or context decision API exists;
- inserted tasks come from accepted insertion facts rather than plan self-certification;
- base/V1/V2 chains are complete;
- generation mixing is rejected;
- task, grant, role, seat, opportunity, revision, catalog, and insertion segments are bound;
- terminal replay re-derives the exact fact;
- shape validation is not represented as canonical provenance;
- anchor and roster bindings are enforced at replay derivation;
- Clockmaker, Dreamer, Seamstress, Cerenovus, Snake Charmer, Witch, Philosopher, and Evil Twin retained classifications match the frozen design;
- hostile shapes fail closed;
- replay is deterministic;
- ledger data do not enter player or AI projections;
- PR and coverage-matrix claims match the implemented ledger-only scope;
- no existing main test is removed or weakened;
- no BOTC interpretation or approved override changed;
- no Mathematician number, Vortox final number, private delivery, or settlement exists;
- 2B18B and 2B19 have not started.

Merge requires one complete independent report with:

- `CODE_REVIEW_PASS`;
- `RULE_REVIEW_PASS`;
- `remainingBlockers: []`.

If repair round 3 does not obtain both pass verdicts, the slice becomes `HUMAN_BLOCKED`. There is no repair round 4.

No merge is authorized until the exact reviewed HEAD, PR HEAD, local HEAD, remote branch HEAD, exact-head CI, complete review report, and both verbatim GitHub audit comments all agree.

## 17. Explicit out of scope

The following remain outside 2B18A:

- any Mathematician true-count evaluation;
- count-resolution window snapshots, their keys, validators, and clones;
- own-ability count exclusion;
- duplicate-holder temporal count policy execution;
- numeric candidate selection;
- source-impaired Mathematician output selection;
- Vortox final false number selection;
- Mathematician information delivery;
- Mathematician private projection;
- `MATHEMATICIAN_INFORMATION` settlement;
- later-night ledger behavior;
- general dawn or day reset;
- nomination, execution, and death lifecycle;
- Witch trigger lifecycle;
- Cerenovus execution consequences;
- Evil Twin later lifecycle;
- continuous poison;
- registration simulation;
- Traveller interactions;
- Pit-Hag and Barber interactions;
- AI, UI, Electron, and SQLite work;
- snapshot migration;
- 2B18B implementation;
- 2B19 implementation.

## 18. Completion criteria

2B18A ledger-only rescope is complete only when:

1. scope review returns `SCOPE_REVIEW_PASS`;
2. the complete public count contract is removed;
3. no replacement count decision API exists;
4. ledger canonical provenance is confined to accepted replay;
5. public validators are honestly identified as shape validators;
6. base/V1/V2 accepted chains are complete and generation mixing fails closed;
7. terminal facts preserve every frozen Design 3.2 classification;
8. anchor, roster, role, impairment, tenure, task, opportunity, insertion, grant, and role-specific delivery cross-links are enforced;
9. all required direct adversarial tests pass;
10. projections contain no ledger or count data;
11. accepted event contracts remain unchanged;
12. Mathematician information remains fail closed with no delivery or settlement;
13. PR and coverage claims describe only the ledger foundation;
14. local gates and exact-head CI pass;
15. the fresh independent final report returns both required pass verdicts with no blocker;
16. 2B18B and 2B19 remain unstarted;
17. coverage status remains `PARTIAL`.

READY_FOR_SCOPE_REVIEW
