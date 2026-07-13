# Phase 3 Slice 2B18B Option A Resolution Evidence

## Resolution metadata

- `sliceId`: `2B18B`
- `candidateRole`: `mathematician`
- `candidateScope`: `FIRST_NIGHT_COUNT_RESOLUTION_INFORMATION_DELIVERY_PRIVATE_PROJECTION`
- `resolutionAuthorization`: `OPTION_A_LEGACY_V1_GAINED_MATHEMATICIAN_ONLY_WITHOUT_BASE_TASK`
- `originalEvidence`: `docs/rules/evidence/2B18B.md`
- `originalEvidenceSha256`: `eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`
- `resolutionKind`: `IMPLEMENTATION_SUPPORT_BOUNDARY`
- `ruleOverrideAdded`: `false`
- `officialRuleChanged`: `false`
- `approvedSimulatorPoliciesChanged`: `false`
- `legacyHistoryReinterpreted`: `false`
- `retrievalDate`: `2026-07-13T07:36:51Z`
- `ruleCoverageStatus`: `PARTIAL`
- `unresolvedConflicts`: `[]`
- `slice2B19Started`: `false`
- `ruleGateStatus`: `RULE_READY`
- `ruleReady`: `true`
- `ruleDesignPass`: `false`
- `implementationAuthorized`: `false`

This document records the user's precise Option A product-support boundary for resolving `2B18B-CONFLICT-001` and the fresh independent rule research that accepted that boundary. It does not overwrite or modify the original `RULE_CONFLICT` evidence. The independent terminal verdict for this resolved evidence is `RULE_READY`; architecture is now permitted, but implementation remains prohibited until an independent `RULE_DESIGN_PASS`.

## Independent research sources

The independent read-only researcher re-read the immutable original evidence, this Option A support boundary, `docs/rules/USER_OVERRIDES.md`, `docs/rules/evidence/2B18-resolved.md`, the accepted 2B17.2 V2 scheduling status, the accepted 2B17.3 V1 compatibility status, the accepted 2B18A status and final reviews, V1/V2 canonical task-plan and runtime validators, current task progress contracts, and the live official and user-specified Wiki sources below.

### sourceUrls

- Official Mathematician: https://wiki.bloodontheclocktower.com/index.php?title=Mathematician&oldid=3109
- Official Philosopher: https://wiki.bloodontheclocktower.com/index.php?title=Philosopher&oldid=2421
- Official States: https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039
- Official Vortox: https://wiki.bloodontheclocktower.com/index.php?title=Vortox&oldid=3017
- 中文数学家: https://clocktower-wiki.gstonegames.com/index.php?title=数学家&oldid=6214
- 中文哲学家: https://clocktower-wiki.gstonegames.com/index.php?title=哲学家&oldid=5125
- 中文涡流: https://clocktower-wiki.gstonegames.com/index.php?title=涡流&oldid=6198
- Fixed official nightsheet: https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json
- Current official nightsheet endpoint: https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json

### sourceRevision / oldid

| Source | oldid / revision | Source timestamp | Retrieved-body SHA-256 |
| --- | --- | --- | --- |
| Official Mathematician | `3109` | `2026-07-08T12:25:10Z` | `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b` |
| Official Philosopher | `2421` | `2024-10-07T14:56:47Z` | `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365` |
| Official States | `1039` | `2023-03-23T01:23:10Z` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Vortox | `3017` | `2025-11-19T16:16:01Z` | `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07` |
| 中文数学家 | `6214` | `2026-06-13T12:07:40Z` | `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e` |
| 中文哲学家 | `5125` | `2025-03-27T11:33:40Z` | `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be` |
| 中文涡流 | `6198` | `2026-06-13T03:21:32Z` | `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff` |
| Official nightsheet | commit `3d6d930a9e600321f93b2567a2e88948a675bc1e` | `2026-05-11T12:28:53Z` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

The fixed and current nightsheet bytes matched exactly at retrieval; the current-endpoint SHA-256 was also `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

### Night-order verification

Zero-based first-night positions:

| Role / boundary | Position |
| --- | ---: |
| Philosopher | 13 |
| Snake Charmer | 36 |
| Witch | 41 |
| Cerenovus | 42 |
| Clockmaker | 59 |
| Dreamer | 60 |
| Seamstress | 61 |
| Mathematician | 76 |
| Dawn | 77 |

Zero-based other-night positions:

| Role / boundary | Position |
| --- | ---: |
| Philosopher | 10 |
| Snake Charmer | 22 |
| Witch | 26 |
| Cerenovus | 27 |
| Vortox | 46 |
| Dreamer | 78 |
| Seamstress | 82 |
| Mathematician | 95 |
| Dawn | 97 |

Other-night behavior remains outside Slice 2B18B. The nightsheet verifies official role order only; it does not define this simulator's legacy V1 duplicate-holder settlement policy.

### Mathematician and Vortox example check

The official and Chinese Mathematician/Vortox examples use different allowed false numbers: the official example delivers false `4`, while the Chinese example delivers false `3`. Both examples have the same true count `6`. This is not a substantive rule conflict: both illustrate Vortox-required false information, and neither requires a unique false number. The approved deterministic smallest-false simulator policy remains explicitly a product policy rather than an official claim.

## Original conflict preserved

The immutable original evidence remains:

- path: `docs/rules/evidence/2B18B.md`;
- SHA-256: `eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`;
- terminal verdict: `RULE_CONFLICT`;
- conflict: accepted legacy V1 base-plus-gained plans order the gained Mathematician before base, while the approved duplicate-holder simulator policy requires base first.

Option A does not claim that either temporal interpretation became official rule truth. It removes the conflicting legacy duplicate combination from the current implementation-support surface while retaining the accepted history unchanged.

## Non-override boundary

Option A has all of the following exact meanings:

1. It is an `IMPLEMENTATION_SUPPORT_BOUNDARY`, not a BOTC rule override.
2. It adds no record to `docs/rules/USER_OVERRIDES.md`.
3. It changes none of the five existing approved simulator policies.
4. It changes no official or Chinese Wiki rule claim.
5. It does not grant legacy V1 gained-before-base ordering new Mathematician rule authority.
6. It does not claim that official BOTC rules prohibit a legacy V1 duplicate-holder state.
7. It does not claim that a V1 base-plus-gained history is invalid under BOTC rules.
8. It states only that the current product cannot safely settle that accepted legacy combination while simultaneously respecting the approved base-first duplicate-holder policy.
9. It does not cancel all legacy V1 compatibility.
10. It does not authorize Slice 2B19.

## Legacy replay and ordering preservation

- Accepted V1 event streams continue to replay according to their recorded V1 events and task order.
- V1 task IDs, V1 insertion facts, plan version, generation, grant, choice, original opportunity, source, seat, chosen role, and gained revision retain their accepted meanings.
- V1 gained-first history is not rewritten as base-first.
- V1 tasks are not moved to the official Mathematician night position.
- V1 histories are not upgraded or migrated to V2.
- V1 replay compatibility does not imply that every replayable accepted history is currently settleable.
- V1 base-plus-gained replay remains accepted history, but both Mathematician settlements fail closed before any Mathematician delivery.
- V2 remains the only supported duplicate-holder settlement generation and continues to use the approved base-first, gained-later order.

## Frozen support matrix

| Canonical plan shape | Settlement support | Required behavior |
| --- | --- | --- |
| Base-only under a legal V1 plan | Supported | Settle the base Mathematician at its canonical base task position; no insertion is required. |
| Base-only under a legal V2 plan | Supported | Settle the base Mathematician at its canonical base task position. |
| Legal V1 gained-only, with no base Mathematician task | Supported | Settle at the recorded historical V1 task position using the complete accepted V1 provenance chain; do not reorder or migrate. |
| Legal V1 base plus legal V1 gained | Intentionally unsupported | Before either Mathematician delivery, fail closed with the exact retryable, receipt-free failure contract below. |
| Legal V2 gained-only, with no base Mathematician task | Supported | Settle the V2 gained source using the complete accepted V2 provenance chain. |
| Legal V2 base plus one or more legal V2 gained tasks | Supported | Base first; gained later; multiple gained tasks order by source seat and then task ID code-unit order. |
| V1 plan plus V2 insertion | Invalid | Reject under the existing exact generation/provenance validators. |
| V2 plan plus V1 insertion | Invalid | Reject under the existing exact generation/provenance validators. |
| V1 task ID plus V2 provenance | Invalid | Reject; no generation migration or inference. |
| V2 task ID plus V1 provenance | Invalid | Reject; no generation migration or inference. |
| Duplicate canonical base task | Invalid | Reject as malformed canonical plan/history. |
| Duplicate gained task or insertion | Invalid | Reject as malformed canonical plan/history. |
| Non-Mathematician role segment or mismatched grant role | Invalid | Reject exact provenance mismatch. |
| Task/source/seat mismatch | Invalid | Reject exact provenance mismatch. |

## Base-only support

`base-only` means the canonical first-night task plan contains exactly one base `ROLE`-sourced `MATHEMATICIAN_INFORMATION` task and contains no Philosopher-gained Mathematician task of either generation.

- Settlement is supported under both a legal legacy V1 plan and a legal current V2 plan.
- Plan version alone must not make a valid base-only task unsupported.
- The task remains at its canonical base Mathematician position.
- No gained insertion is required.
- The source contract is `BASE_MATHEMATICIAN`.
- Existing source, roster, seat, role, character-state, task-plan, task-progress, and canonical ability-instance validation remains mandatory.

## Legacy V1 gained-only support

`V1 gained-only` means the canonical first-night task plan contains one legal V1 `PHILOSOPHER_GAINED_ABILITY`-sourced `MATHEMATICIAN_INFORMATION` task and no base Mathematician task.

Settlement is supported only when all accepted V1 contracts validate:

- legal V1 task plan;
- unique legal V1 recorded insertion;
- legal V1 task ID and task grammar;
- Philosopher grant and choice;
- original Philosopher opportunity;
- source player and seat;
- chosen role `mathematician`;
- role segment and grant role;
- exact gained character-state revision and canonical ability-instance identity;
- absence of V2-only fields or V2 provenance.

The gained task executes at its recorded historical V1 position. It is not moved to the normal Mathematician position and is not converted into a V2 task.

## Legacy V1 base-plus-gained boundary

If the same canonical first-night plan contains both:

1. a canonical base `ROLE`-sourced `MATHEMATICIAN_INFORMATION` task; and
2. a canonical V1 `PHILOSOPHER_GAINED_ABILITY`-sourced `MATHEMATICIAN_INFORMATION` task reconstructed from its unique legal V1 insertion with `chosenRoleId=mathematician`;

then both tasks are classified as:

`UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER`

This combination is replay-compatible but not settlement-supported in Slice 2B18B. The application must detect it before any Mathematician information delivery, regardless of which of the two task IDs a caller attempts to settle.

The application must not:

- settle the gained task first;
- skip the canonical-next gained task to settle base;
- alter task progress or action-opportunity progress;
- move the base task earlier;
- reorder the V1 task;
- migrate or regenerate the plan as V2;
- resolve a partial Mathematician count or candidate set;
- generate a `MathematicianInformationDelivered` event;
- generate a Mathematician terminal ledger fact;
- settle either task;
- consume the command ID.

## V2 gained-only support

A legal V2 gained Mathematician task with no base Mathematician task is supported. It must retain the accepted V2 plan, insertion, task, grant, opportunity, source, seat, role-segment, revision, scheduling-version, and canonical ability-instance contracts. No V1 field or provenance may be mixed into it.

## V2 duplicate-holder support

V2 is the only duplicate-holder generation supported for settlement:

1. base Mathematician resolves first;
2. Philosopher-gained V2 Mathematician resolves later;
3. multiple gained V2 tasks order by `sourceSeatNumber` ascending;
4. equal-seat ties order by `taskId` using stable code-unit comparison;
5. a later holder may count an earlier holder's already completed qualifying `ABNORMAL` fact;
6. an earlier holder cannot read a future holder's fact;
7. an earlier delivered number is never recomputed after a later settlement.

These semantics continue the existing approved `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1` product policy. Option A does not modify that policy.

## Canonical task-plan detection

The support decision must be derived from the accepted event stream's validated canonical first-night task plan and its recorded insertion facts. It must not be derived from a caller-created state, a caller-created ledger, or the current number of players whose latest role is Mathematician.

### hasBaseMathematicianTask

`hasBaseMathematicianTask` is true only when the canonical plan contains a task satisfying all of:

- `taskType = MATHEMATICIAN_INFORMATION`;
- `task.source.kind = ROLE`;
- task ID equals the canonical base Mathematician task ID;
- the task source is bound to the original legal base Mathematician task fact;
- the plan contains no duplicate base task and passes the existing exact task-plan validators.

### hasV1GainedMathematicianTask

`hasV1GainedMathematicianTask` is true only when the canonical plan contains a task satisfying all of:

- `taskType = MATHEMATICIAN_INFORMATION`;
- `task.source.kind = PHILOSOPHER_GAINED_ABILITY`;
- generation is exactly `V1`;
- the task is reconstructed from one unique legal recorded V1 insertion;
- `chosenRoleId = mathematician`;
- the complete accepted V1 task/grant/choice/original-opportunity/source/seat/role/revision/ability-instance chain validates;
- no V2-only field, insertion, task ID, or provenance is mixed in.

### Duplicate decision

If `hasBaseMathematicianTask && hasV1GainedMathematicianTask`, the plan is unsupported for Mathematician settlement even if the original base source later changes character. This boundary addresses the historical task-plan ordering conflict, not the current count of Mathematician role holders.

The following heuristic is forbidden:

`current number of Mathematician role holders`

Latest `CurrentCharacterState`, later role changes, later alignment changes, or latest-role counting cannot erase or bypass the plan-level conflict.

## Fail-closed application contract

The unsupported V1 duplicate combination must be detected before:

- count resolution;
- legal-candidate construction;
- deterministic number selection;
- event metadata generation;
- delivery-event construction;
- terminal ledger-fact construction;
- prospective batch validation;
- receipt writing;
- event-store append;
- task or opportunity progress mutation.

The exact application result is:

```text
status = failed
code = ApplicationNotConfigured
failureStage = first-night-role-information
retryable = true
```

Stable internal details are:

```text
reason = LEGACY_V1_DUPLICATE_MATHEMATICIAN_ORDER_UNSUPPORTED
taskPlanVersion = first-night-task-plan-v1
baseTaskId = <canonical base task id>
gainedTaskId = <canonical V1 gained task id>
```

Failure effects are exactly:

- no command receipt;
- no domain events;
- no event metadata allocation;
- no game-version increment;
- no ledger fact;
- no task settlement;
- no action-opportunity or first-night progress change;
- same command ID remains retryable after future product support changes;
- restart/rebuild produces the same fail-closed result from the same accepted history.

The stable reason and task details are internal diagnostics. They must not appear in player or AI projections.

## Character-state boundary

- A later role change by the original base source does not turn a V1 base-plus-gained plan into gained-only.
- A later role change does not change the recorded V1 order or insertion history.
- Gained-only settlement must still validate the applicable source contract at settlement as required by the eventual reviewed design.
- Current-role-holder counting cannot replace canonical task-plan detection.
- Historical information and historical accepted task facts are not recomputed from later character or alignment state.

## Required Option A regression matrix

### V1 base-only

1. legal V1 plan with only base Mathematician;
2. base task retains normal canonical position;
3. settlement succeeds;
4. delivery and settlement form the approved batch;
5. no insertion is required;
6. source contract is `BASE_MATHEMATICIAN`;
7. terminal ledger fact validates;
8. replay validates;
9. private projection exposes only the selected count.

### V1 gained-only

10. legal V1 plan with only gained Mathematician;
11. no base Mathematician task exists;
12. gained task remains canonical-next at its V1 historical position;
13. settlement succeeds;
14. source contract is `PHILOSOPHER_GAINED_MATHEMATICIAN_V1`;
15. grant, insertion, choice, original opportunity, source, seat, role, revision, and ability instance bind exactly;
16. no V2 task or migration is produced;
17. delivery, settlement, ledger fact, and replay validate;
18. private projection exposes only the selected count.

### V1 base plus gained

19. canonical V1 plan contains both base and gained tasks;
20. gained task remains canonical-next first under accepted V1 order;
21. settling gained returns `ApplicationNotConfigured`;
22. reason is `LEGACY_V1_DUPLICATE_MATHEMATICIAN_ORDER_UNSUPPORTED`;
23. `retryable=true`;
24. no receipt is written;
25. no event is produced;
26. gained is not settled;
27. base is not settled;
28. game version is unchanged;
29. ledger is unchanged;
30. opportunity and first-night progress are unchanged;
31. retrying the same command ID remains a retryable failure;
32. requesting base cannot skip the gained task or partially settle;
33. restart/rebuild preserves the same fail-closed result;
34. player and AI projections do not expose the limitation reason or task details.

### V2 matrix

35. V2 base-only succeeds;
36. V2 gained-only succeeds;
37. V2 base-plus-gained resolves base first;
38. after base settles, gained becomes next;
39. later gained may read earlier base terminal fact;
40. earlier base cannot read future gained fact;
41. multiple gained ordering remains seat then task ID code-unit;
42. every V1/V2 mix is rejected.

### Character-state changes

43. V1 plan with base plus gained remains unsupported after the base source ceases to be Mathematician;
44. gained-only source validity still uses the exact accepted source contract at settlement;
45. latest-role counting cannot bypass the plan conflict.

## Explicitly unchanged 2B18B rule claims

Option A changes none of the original non-conflicting 2B18B rule claims:

- count distinct players, not incidents;
- ignore `NORMAL` and nonblocking `PENDING_TRIGGER`;
- same-player `UNRESOLVED` is redundant after a qualifying abnormal fact, otherwise unresolved blocks;
- ordinary impairment alone is not counted and an impaired normal result is not counted;
- exclude the resolving source and current ability instance;
- do not globally exclude another player's earlier Mathematician fact by role ID;
- first-night window is exclusive after `FirstNightInitialized` through the inclusive last canonical event before resolution;
- numeric domain is the exact dense integers `0..11`;
- ordinary impairment may legally receive true or false information, while the product policy selects smallest false;
- effective Vortox requires false information, including when impairment also exists;
- stored historical facts are not rewritten from later state;
- only first-night Mathematician is in scope.

## Explicit out of scope

- any V1-to-V2 migration or rewriting mechanism;
- any V1 base-plus-gained partial settlement;
- adopting gained-before-base as an official or approved general Mathematician rule;
- changing the five existing `USER_OVERRIDES` records;
- general dawn reset, day transition, other-night Mathematician, Storyteller free-number selection, registration, life/death, or unsupported character-change engines;
- UI, Electron, SQLite, or AI strategy;
- Slice 2B19.

## Coverage status

`PARTIAL`

Option A only defines the implementation-support boundary needed to remove an unresolvable temporal choice from the bounded Slice 2B18B surface. Count resolution, information delivery, settlement, ledger adapter, stored validation, and private projection remain unimplemented at this gate. Other-night and broader interactions remain unsupported.

## Independent rule-research confirmations

The independent read-only researcher confirmed all ten required propositions:

1. **No official-rule change:** Option A changes no official or Chinese BOTC rule claim.
2. **No override or approved-policy change:** Option A adds no rule override and changes none of the five approved simulator policies, including the V2 base-first duplicate-holder policy.
3. **No V1 gained-first authority:** accepted V1 gained-first event order receives no new general Mathematician rule authority.
4. **V1 replay/order fixed:** accepted V1 history continues to replay in its recorded order, without reordering, migration, or reinterpretation.
5. **V1 gained-only has no duplicate conflict:** without a base task there is no choice between gained-first and base-first, so the accepted V1 gained-only task may be supported at its historical position.
6. **V1 base-only has no duplicate conflict:** without a gained task there is no duplicate-holder temporal choice, and plan version alone does not invalidate base-only settlement.
7. **V1 base-plus-gained choice removed before settlement:** explicitly making this combination settlement-unsupported and failing closed before either Mathematician delivery removes the need to choose between two incompatible order contracts while preserving replay history.
8. **V2 full duplicate support remains:** V2 continues to support base first, gained later, stable multi-gained ordering, later-reading-earlier, and no future feedback.
9. **No new `USER_OVERRIDES` record:** the boundary is fully and honestly represented as product support scope, so no additional override is required.
10. **Slice 2B19 unstarted:** no research, design, implementation, branch, test, or PR for Slice 2B19 has begun.

## unresolvedConflicts

`[]`

The original `2B18B-CONFLICT-001` remains preserved in immutable historical evidence. It is not an active unresolved conflict after Option A because the unsupported legacy combination is removed transparently from the settlement-support surface rather than assigned a guessed temporal interpretation.

## Terminal rule verdict

- `ruleCoverageStatus`: `PARTIAL`
- `unresolvedConflicts`: `[]`
- `terminalVerdict`: `RULE_READY`
- `architectureAuthorized`: `true`
- `implementationAuthorized`: `false`

Architecture may now design the bounded Slice 2B18B against this resolved evidence. Implementation still requires a fresh independent `RULE_DESIGN_PASS` and must not begin from this evidence alone.

RULE_READY
