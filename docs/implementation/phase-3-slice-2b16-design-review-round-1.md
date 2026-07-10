# Phase 3 Slice 2B16 — Independent Rule Design Review

## Review metadata

- `reviewedHead`: `ec9c546797070dfa5ab3d1d7838de16d14941358`
- `origin/main`: `ec9c546797070dfa5ab3d1d7838de16d14941358`
- `reviewTimestamp`: `2026-07-10T14:56:52Z`
- `worktreeClean`: `true`
- `reviewedDesign`: `docs/implementation/phase-3-slice-2b16-design.md`
- `reviewedDesignSha256`: `82cf080b1eceffbf6ec5efaf6bf38c2e5164413620f7e1185e3d616f2c56adaf`
- `reviewedEvidence`: `docs/rules/evidence/2B16.md`
- `reviewedEvidenceSha256`: `6306ec6c008c72c276ccbf1fcddc0b14dd299ae5ded015c1bb55b6693aff2ef9`
- Review type: independent, read-only, pre-implementation rule-design review.
- No files, branches, commits, PRs, or external systems were modified.

## Independent source verification

All recorded page revisions and content hashes matched live MediaWiki responses:

| Source | Revision | MediaWiki SHA-1 | UTF-8 SHA-256 |
|---|---:|---|---|
| Chinese Cerenovus | 4198 | `366ffff16b101f72877a40e9cdf8b0c056241500` | `2d4bd29cb1dd876a413f885d7c4f0df5f1f53f172608355c0584f50eb7f58eba` |
| Chinese Madness | 5883 | `0f41f02a9506a24db6ff7c7b942a0944bb600fbb` | `f1cd491b1c5c6473f73045196f1742737aa8cee3f4b7e2a714544298bc8c5ffd` |
| Chinese Goblin | 6148 | `0de04eb7b8dcb67961a0e8808b50a8e87d2e7d1b` | `907db9a346e0099eebcd217ff96b5723f438e5b67d51a7902f9f9763bcfb6659` |
| Official Cerenovus | 3048 | `b3e3c515168fbab8e7c8a04eb949090fe4edb83d` | `fd60de683c2aade3618f4784123184bfb7b9d50c3c5e6ed804261edbd187fa5c` |
| Official States/Madness | 1039 | `766aebdbebec64ffffc979e4c7170ea58ad4a6b8` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Glossary | 2874 | `a55d4738a77d6ef6382fda26341a94408d86012d` | `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee` |
| Official Abilities | 1376 | `0317b459c78ee1eef0a3fbec17fd9d6d1f9f9a95` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| Storyteller Advice | 2552 | `69252559a401fdd85b0d7e35a993a0a00cd635d4` | `9ddb0953b1d6a993d390096a7a163ae572ea82e11bd81426947cbc13afba5d12` |
| Character Types | 1495 | `96259315656dfc575c7ebb55c0fe9eb53655a7ff` | `0558da745c592375f1a9286eccec61eb7cf535b986f982e7a2276955fb15ed20` |
| Official Goblin | 2976 | `5d2c1bd299b60685cd8c1fa90be47679698c9c44` | `92c7765112002f7ec46296ef36e2e5bb6d65acb12dc14b4f65046eb15dd20cd5` |
| Official Vigormortis | 3015 | `12d6701fee4cfba93b9855fd8526e71363e8b79f` | `9f0eef75059ccf4b9dea02aac7daa4b102920e0860cfdb1d055c569141597a6f` |

The standalone official `Madness` title is absent; the applicable live rules are under `States#Madness`, as recorded.

Official nightsheet verification:

- Main: `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- File commit: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- Blob: `e5242b7e31299cb6d685f921aeaffc5e403be08f`
- SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- First night: index 42 of 80, `witch → cerenovus → fearmonger`
- Other night: index 27 of 99, `witch → cerenovus → pithag`

No substantive conflict exists among the external sources. The notification simulation for an impaired source is supported: the target receives the normal private presentation, while no real requirement, marker authority, or execution authority is created.

## Files and areas reviewed

Rule and design material:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B16.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b16-design.md`
- `project-handoff/rules/14-madness-system.md`
- `project-handoff/rules/18-sects-and-violets-roles.md`
- Relevant Cerenovus rule cases in `project-handoff/tests/25-rule-test-cases.md`

Architecture:

- `docs/architecture/07-state-and-projections.md`
- `docs/architecture/08-night-task-model.md`
- `docs/architecture/09-effect-lifecycle.md`
- `docs/architecture/10-information-model.md`
- `docs/architecture/11-storyteller-decision-model.md`
- `docs/architecture/14-testing-strategy.md`
- `docs/architecture/20-rule-execution-model.md`
- `docs/architecture/21-phase-state-machine.md`

Current production contracts and relevant tests:

- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/game-phase.ts`
- `packages/domain-core/src/phase-transition-policy.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/application/src/game-application-service.ts`
- `packages/application/src/command-result.ts`
- `packages/application/src/ports/command-commit-store.ts`
- `packages/projections/src/index.ts`
- `packages/rules-snv/src/index.ts`
- `packages/task-engine/src/index.ts`
- Relevant application, replay, batch, projection, task, and architecture-boundary tests.

## Findings

### 1. Blocking — proposed command and task-source schemas do not match the repository command model

The design defines `SubmitCerenovusAction` as a non-generic `CommandEnvelope` with a top-level `type`, `taskId`, `opportunityId`, and `decision` at [phase-3-slice-2b16-design.md:80](C:\Users\wjl\Documents\血染钟楼\docs\implementation\phase-3-slice-2b16-design.md:80). Current commands use `CommandEnvelope<TPayload>` and put the discriminator and command-specific fields under `payload`, using `commandType`; see [command.ts:29](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\command.ts:29) and [command.ts:109](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\command.ts:109).

The design also describes an exact task source as `{ sourceKind: "ROLE", sourceRole: "cerenovus" }` at design line 93. Runtime scheduled tasks instead use `source.kind` and a full `source.role` snapshot; see [first-night-task-plan.ts:59](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\first-night-task-plan.ts:59).

Required fix:

- Define `SubmitCerenovusActionCommandPayload` with `commandType: "SubmitCerenovusAction"`.
- Define the command as `CommandEnvelope<SubmitCerenovusActionCommandPayload>`.
- Validate the real runtime source contract: `task.source.kind === "ROLE"` and `task.source.role.roleId === "cerenovus"`, including player, seat, opportunity, and character-state revision linkage.
- State the exact actor matrix. Human/AI submissions must match the source player. Storyteller/System must not acquire authority to select the target or character; if allowed only as transport, that boundary must be explicit and testable.

### 2. Blocking — the exact event and settlement shapes are incompatible with existing replay contracts

The three “exact payload” definitions at design lines 130–244 omit established provenance and linkage fields used by current role events, including `rulesBaselineVersion`, `nightNumber`, `taskType`, source seat, source role snapshot, and source/settlement character-state revision. Existing Witch and Dreamer events demonstrate these requirements at [witch.ts:40](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\witch.ts:40) and [dreamer.ts:51](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\dreamer.ts:51).

The impaired variant also types `impairmentSourceKind` as an unrestricted `string`, while the represented impairment store is a closed union; see [philosopher-ability.ts:104](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\philosopher-ability.ts:104).

The neutral settlement is specified with `outcome` at design lines 103–107, but the current exact field is `outcomeType`; see [first-night-task-plan.ts:110](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\first-night-task-plan.ts:110).

Required fix:

- Replace `outcome` with `outcomeType`.
- Revise all three exact event payloads to carry sufficient rules-baseline, task, source, seat, and revision provenance, or document an equally exact indirect linkage compatible with the event applier.
- Use the closed represented-impairment source union, not `string`.
- Add explicit retryable event-construction, dependency, event-metadata, prospective-validation, and persistence-failure regressions; none may burn the command ID or persist a partial batch/accepted receipt.

### 3. Blocking — the claimed real requirement record lacks stable source-ability identity

The effective resolution at design lines 164–200 records only `sourcePlayerId` and the literal role. It does not bind the requirement to a stable role tenure, ability instance, source character-state revision, or dependency policy.

That is insufficient for the sourced rule that the requirement ends when the source loses the Cerenovus ability and must not revive merely because the same player later reacquires Cerenovus. It also prevents future suppression/resumption logic from distinguishing the original ability tenure. The architecture requires source ability/dependency identity for persistent effects; see [20-rule-execution-model.md:36](C:\Users\wjl\Documents\血染钟楼\docs\architecture\20-rule-execution-model.md:36) and [09-effect-lifecycle.md:8](C:\Users\wjl\Documents\血染钟楼\docs\architecture\09-effect-lifecycle.md:8).

Required fix:

- Bind the creation record to a stable `sourceRoleTenureId`/`sourceAbilityId` or an equivalent reviewed immutable identity, plus the evaluated settlement revision and dependency semantics.
- Specify that permanent tenure loss ends that record and later reacquisition cannot resume it.
- If this identity cannot be modeled within the bounded slice, remove the claim that a real requirement/marker fact is created and reduce the slice to historical choice/notification recording; doing that would also require revising evidence trace 10.

### 4. Blocking — private projection does not validate the complete stored chain

The projection section at design lines 282–288 validates only the stored notification and linked choice. Evidence regression 16 requires validation from the complete historical chain, including resolution and settlement, at [2B16.md:246](C:\Users\wjl\Documents\血染钟楼\docs\rules\evidence\2B16.md:246).

Current projections fail closed using complete delivery chains and matching settlements; the Seamstress architecture states that explicitly at [10-information-model.md:242](C:\Users\wjl\Documents\血染钟楼\docs\architecture\10-information-model.md:242).

Required fix:

Before either player or AI projection, require exactly one:

- closed matching Cerenovus opportunity;
- matching choice;
- matching represented resolution;
- matching notification;
- matching `ScheduledTaskSettled` fact.

Validate deterministic IDs, source/task/opportunity/choice linkage, branch validity, recipient, token tuple, catalog role, revision, and global uniqueness. Missing, duplicate, malformed, cross-reused, or mismatched facts must fail closed.

### 5. Blocking — duration language contradicts the verified rule and the design’s own anchors

Design rule claim 4 says the target is mad “until dusk” at design line 17, and trace item 15 again says the duration “reaches dusk” at line 515. The live official rule is “tomorrow,” and the operational rule is “during the next day or night.” The Chinese rule likewise says the following day and night. The design’s actual counters at lines 174–193 correctly extend through the following night and end on entry to dawn.

Required fix:

- Remove every “until dusk” statement.
- State consistently that the first-night selection applies during day 1 and the following night, ending at `DAWN_RESOLUTION(dayNumber=1, nightNumber=2)`.
- Preserve the distinction between the fixed natural end anchor and earlier termination caused by source-ability loss, which remains lifecycle work.

### 6. Blocking — projection ordering references nonexistent persisted stage literals

Design line 280 orders the new stage relative to `EVIL_TWIN_PRIVATE_NOTIFICATION` and `DREAMER_PRIVATE_INFORMATION`. Those literals do not exist. Current persisted literals are `EVIL_TWIN_SETUP_INFORMATION` and `DREAMER_INFORMATION`; see [initial-private-knowledge.ts:32](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\initial-private-knowledge.ts:32) and [initial-private-knowledge.ts:268](C:\Users\wjl\Documents\血染钟楼\packages\domain-core\src\initial-private-knowledge.ts:268).

Required fix:

- Define the exact new `PlayerPrivateKnowledgeStage` literal.
- Place it between the actual `EVIL_TWIN_SETUP_INFORMATION` and `DREAMER_INFORMATION` literals.
- Update the stage/value/model-version coupling rules and tests, not only the display ordering.

### 7. Blocking — the recorded other-night raw nightsheet identifier is wrong

The live official raw nightsheet contains:

```text
witch -> cerenovus -> pithag
```

The evidence instead records `pit_hag` at lines 85–86 and regression 1 at line 231. These strings are not equal.

Required fix:

- Correct the evidence to the exact raw identifier `pithag`.
- Make the design’s nightsheet metadata regression assert the raw literal while separately displaying the human label “Pit-Hag.”
- Regenerate the evidence/design hashes and obtain a fresh independent review.

## All 23 required regression traces

| # | Status | Review result |
|---:|---|---|
| 1 | Revise | First-night order is correct; other-night raw literal must be `pithag`. |
| 2 | Covered | Supported subset `600/700/800` is kept separate from official immediate-neighbor claims. |
| 3 | Revise | Intent is present, but actual task-source and command-envelope contracts must be corrected. |
| 4 | Covered | Safe target/character decision surface excludes hidden outcome fields. |
| 5 | Covered | Self-targeting is explicitly accepted. |
| 6 | Covered | Roster-only target validation is honestly partial regarding life/Traveller state. |
| 7 | Covered | On-script Townsfolk/Outsider selection does not depend on assignment/in-play status. |
| 8 | Covered | Ordinary unsupported character types and off-script roles are rejected. |
| 9 | Covered | Goblin jinx remains fail-closed and out of scope. |
| 10 | Revise | Atomic path is designed, but the real requirement lacks stable source-ability identity and exact compatible payloads. |
| 11 | Covered | Drunk/poisoned choice and notification are separated from requirement/marker authority. |
| 12 | Covered | The stale no-notification assertion is explicitly replaced. |
| 13 | Covered | Notification token order matches the sourced running instructions. |
| 14 | Covered | Recipient-only human/AI projection is required. |
| 15 | Covered | Branch identity and impairment metadata are excluded from live projections and receipts. |
| 16 | Revise | Projection currently validates only notification plus choice, not the complete historical chain. |
| 17 | Revise | Numeric anchors are correct, but “until dusk” is incorrect and source-loss dependency identity is missing. |
| 18 | Covered | Enforcement, execution, death, recurrence, lifecycle, and related events are forbidden. |
| 19 | Covered | Actor-supplied effectiveness, marker, requirement, and execution facts are forbidden. |
| 20 | Revise | The validation layers are named, but exact command/event/settlement schemas and explicit metadata/dependency failure tests require correction. |
| 21 | Covered | Deterministic IDs and prohibited primitive checks are explicit. |
| 22 | Covered | Witch behavior is explicitly preserved and not generalized incorrectly. |
| 23 | Revise | Preservation intent exists, but the new projection stage is anchored to nonexistent literals. |

## Scope and coverage assessment

The bounded first-night choice/notification concept is appropriate, and keeping Cerenovus `PARTIAL` is correct. Other-night recurrence, Goblin, Vigormortis, Traveller execution immunity, madness judgment, enforcement, execution, death, suppression/resumption, and general effect lifecycle remain properly out of scope.

The architecture review’s decisive constraint is immutable future-safe history: a creation record intended to support later lifecycle behavior must identify the exact source ability tenure and complete delivery chain. A player ID plus role literal is not sufficient.

## Remaining blockers

1. Correct the command envelope, task-source contract, and actor policy.
2. Correct the event payload provenance, closed impairment type, and `outcomeType` settlement field.
3. Add stable source-tenure/ability identity and dependency semantics to the effective requirement record, or reduce the claimed scope.
4. Require complete projection-time chain validation.
5. Remove the incorrect “until dusk” duration language.
6. Replace nonexistent projection-stage anchors with actual persisted literals.
7. Correct the official other-night raw identifier from `pit_hag` to `pithag`.
8. Regenerate evidence/design hashes and submit the corrected exact head for a fresh independent review.

Implementation remains unauthorized.

## Final verdict

RULE_DESIGN_FIX_REQUIRED
