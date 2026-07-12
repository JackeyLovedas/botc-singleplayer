reviewedHead:
- `5a40c04ec50224ce05b43588a54ac0d5253a5ffd`
- branch: `main`
- local HEAD = origin/main = GitHub main HEAD
- exact-head CI: `29187068406` — `SUCCESS`
- open PRs: `0`
- worktree: clean

reviewedDesign:
- `docs/implementation/phase-3-slice-2b18a-design-round-3-1.md`
- SHA-256: `97456a3769d29b616af31c1e83dc5b1717809ffbe5a56ab0d86decd800c9710c`
- authorization: `DESIGN_ROUND_3_1_CONTRACT_COMPLETION`
- behaviorDesignFrozen: `true`
- coverageStatus: `PARTIAL`
- terminal line: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_1`

parentDesign:
- `docs/implementation/phase-3-slice-2b18a-design-round-3.md`
- SHA-256: `08d23c8cdef156edd7a90f7f1ee8725ae7b6d29c3809d967343221c1d37eebe8`

parentReview:
- `docs/implementation/phase-3-slice-2b18a-design-review-round-3.md`
- SHA-256: `5d43e80a7591785b7825113a27bd7d1b9c7ff724eebfb78e32b403c785625d1b`
- verdict: `RULE_DESIGN_FIX_REQUIRED`

authorizationReviewed:
- `C:\Users\wjl\.codex\attachments\aa6622d7-31ce-4317-badc-487fe8967fc9\pasted-text.txt`
- Round 3.1 is contract completion only, not a new behavioral design round.
- A non-pass verdict requires the controller to enter `HUMAN_BLOCKED`; no further design completion or implementation is authorized.

ruleEvidenceReviewed:
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-resolved.md`
- resolved evidence SHA-256: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/rules/evidence/2B18-prerequisite-status.md`
- `docs/implementation/phase-3-slice-2b18a-design.md`
- `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`
- `docs/implementation/phase-3-slice-2b18a-design-round-3.md`
- `docs/implementation/phase-3-slice-2b18a-design-review-round-3.md`

approvedOverridesReviewed:
- `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`
- `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`
- `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`
- `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`
- no override was added or changed by Design 3.1

externalSourcesIndependentlyReverified:
- Official Mathematician oldid `3109`: SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official States oldid `1039`: SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
- Official Vortox oldid `3017`: SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Philosopher oldid `2421`: SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
- Official Witch oldid `2682`: SHA-256 `330953478cfc8a035a49fcbf379edff35d5f50c9efa37310323ccc40b2f364ef`
- Official Dreamer oldid `2904`: SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
- Chinese 数学家 oldid `6214`: SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Chinese 女巫 oldid `4971`: SHA-256 `3c1a75e2f88d7098e5816508d469b5ecc316fd0a721a9c3bf712799839cac0b2`
- Chinese 筑梦师 oldid `3046`: SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`: SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- no new external-rule conflict was found; `RULE_READY` remains valid

productionFilesReviewed:
- `packages/domain-core/src/ids.ts`
- `packages/domain-core/src/player-roster.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/index.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- `packages/task-engine/src/index.ts`

testFilesReviewed:
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/domain-core/src/snake-charmer.test.ts`
- `packages/domain-core/src/witch.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/domain-core/src/clockmaker-replay.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/task-engine/src/first-night-task-planner.test.ts`

scopeIntegrity:
- no production or test implementation was added
- no feature branch or PR exists
- accepted event, payload, batch, receipt and settlement contracts remain unchanged
- no `MathematicianInformationDelivered`
- no `SettleMathematicianInformation`
- no `MATHEMATICIAN_INFORMATION` settlement
- no private Mathematician number delivery
- 2B18B and 2B19 were not started

verificationByContract:

1. Frozen Round-3 behavioral classifications: `PASS`
   - public resolver remains state-bound
   - Witch classifications remain `WitchDeathPendingMarked=NORMAL` and `WitchIneffectiveResolved=PENDING_TRIGGER`
   - Cerenovus marker remains no-fact and instruction delivery remains `NORMAL`
   - Dreamer/Vortox three-state classification remains intact
   - terminal decisions continue to use pre-event state
   - outcome status and counting behavior did not change

2. `InternalResolvingMathematicianContext`: `PASS`
   - complete fields and nested roster types are present
   - exact-key arrays are present
   - canonical roster shape matches the accepted fixed roster
   - base and Philosopher-gained source verification is specified
   - type, builder, validator and context resolver are module-private
   - context is not persisted, projected or accepted from callers

3. Four-override carrier: `PASS`
   - version literal, four exact override literals and exact-key set are frozen
   - state-bound resolver constructs it internally
   - it is not read from state, commands or callers

4. Canonical ability-instance identity: `PASS`
   - base, gained V1, gained V2 and explicit formats are frozen
   - formatter/parser contracts and branded unified ID are present
   - provenance variants and exact keys are complete
   - parser round-trip and embedded task/grant/role/instance cross-checks are required

5. `FirstNightAbilityOutcomeFact`: `PASS`
   - complete exact shape is present
   - legal status/cause/boolean combinations are frozen
   - fact/event/instance cross-links and minimum evidence are required
   - terminal allowlist and no-fact list are explicit

6. `MathematicianCountResolution`: `PASS`
   - complete `RESOLVED` and `UNRESOLVED` variants are present
   - exact-key arrays and mutually exclusive fields are defined
   - stable ordering, dense arrays, uniqueness, complete fact classification and count consistency are required
   - shape validator and deep clone responsibilities are present

7. Public/non-public API: `PASS`
   - the single public resolver is exactly `resolveFirstNightMathematicianTrueCountFromState(stateBeforeResolution: unknown)`
   - no caller-supplied ledger/context resolver is exported
   - public exports and prohibited internal exports are explicitly enumerated

8. Evidence-reference shape and ordering: `PASS`
   - all eight variants and their exact-key arrays are present
   - fixed kind rank, primary ordering, code-unit comparison, deduplication and conflicting-identity rejection are present
   - hostile structural validation is required

9. Evidence-reference semantic cross-link contract: `BLOCKER`
   - Design 3.1 does not freeze how most evidence variants must cross-link to the fact and accepted canonical records.
   - Only `SOURCE_EVENT` is explicitly required to match the fact’s event ID, type, sequence and batch.
   - It does not state explicitly that `TASK.taskId` must equal `fact.abilityTaskId`, nor how its `taskType` is proven against the terminal adapter.
   - It does not freeze the required relation of `ACTION_OPPORTUNITY` to the fact’s task/source, the relation of `ABILITY_IMPAIRMENT` to source player, cause and evaluated revision, or the relation of `ROLE_TENURE` to provenance and historical revision.
   - `DOMAIN_RECORD.recordId` remains an unconstrained `string` without a record-type-to-canonical-ID mapping. Existing records use materially different identities: grant ID, inserted task ID, pair ID, pending-death/marker ID, instruction/delivery ID and role-specific resolution identity. The design does not say which accepted identity must populate `recordId` for each of its nine `recordType` literals.
   - Consequently, two conforming implementers can produce different canonical evidence arrays for the same accepted event stream, and the conflict/deduplication validator cannot be implemented uniformly without inventing a mapping.
   - `PLAYER_ROLE_AT_REVISION` is ordered first by `playerId` and then revision, but “same primary identity with conflicting content” is not defined as either `playerId` alone or `(playerId, characterStateRevision)`. Those interpretations reject different inputs.
   - The generic statement that validators perform cross-link checks does not resolve these variant-specific identities and relations.
   - This directly fails the authorized requirement that the evidence union be complete in shape, cross-linking and ordering and that the implementer not invent missing contract decisions.

findings:
- The five contract groups that caused the Round-3 review failure are now materially present.
- The prior three behavioral blockers remain closed.
- Rule truth remains ready and coverage remains correctly `PARTIAL`.
- The remaining issue is not a BOTC rule conflict and does not authorize a new interpretation. It is a security/replay design-completeness defect in the only implementation authority.
- Because evidence references are canonical audit material used for replay, hostile validation and rule-to-test traceability, their unresolved identity/cross-link mapping cannot be deferred to implementation.
- The user authorized no further completion pass if this independent review does not pass.

requiredFix:
- None is authorized in the current run.
- A technically complete design would need an exact per-variant cross-link matrix and a `DOMAIN_RECORD.recordType -> canonical recordId source` mapping, including the compound identity for `PLAYER_ROLE_AT_REVISION`; however the current authorization requires stopping instead of adding another design pass.

remainingBlockers:
- `AbilityOutcomeEvidenceReference` has complete structural variants but lacks the exact per-variant semantic cross-link and canonical record-identity mapping needed for deterministic implementation and validation.

RULE_DESIGN_FIX_REQUIRED
