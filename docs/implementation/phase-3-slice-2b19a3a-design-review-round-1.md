# Phase 3 Slice 2B19A3A — Independent Rule Design Review Round 1

## reviewedDesign

- path: `docs/implementation/phase-3-slice-2b19a3a-design.md`
- sha256: `fb9dc655ba718030dde3208f2a3f3fc51e9582fcef0f3b2db4cccbaabfa9c794`
- terminal: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`
- designRound: `1 / 2`

## reviewedEvidence

- path: `docs/rules/evidence/2B19A3A.md`
- sha256: `2da6b7c9d6fea31bbab05674ac3e6a45213257c7af314f66d47eb4a8436f84b6`
- ruleResearchVerdict: `RULE_READY`
- unresolvedConflicts: `[]`

## reviewedGovernance

- path: `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md`
- sha256: `ccb73944855c4eb110335462aba32865cb5dbd357db2733dfae6e2b1980426f9`
- governanceVerdict: `GO`

## reviewIdentity

- reviewedRepositoryHead: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- reviewedBranch: `phase-3/dreamer-vortox-effective-source`
- reviewTimestamp: `2026-07-17T12:53:24.0222926+08:00`
- implementationState: no production or test modification for 2B19A3A; `ruleDesignPass=false`; `implementationAuthorized=false`.
- worktreeScope: only the expected four agent-loop control files plus the governance, evidence, and design documents are modified/untracked.

## sourcesIndependentlyRead

The review independently retrieved/read the live fixed-revision sources and did not rely only on the rule-researcher summary, repository tests, README, or model memory.

- `docs/rules/USER_OVERRIDES.md`, SHA-256 `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`; no Dreamer/Vortox ability override.
- User-specified Chinese Wiki homepage `oldid=5855`, SHA-256 `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`.
- Chinese Dreamer/筑梦师 `oldid=3046`, SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`.
- Chinese Vortox/涡流 `oldid=6198`, SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`.
- Chinese Mathematician/数学家 `oldid=6214`, SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`.
- Official Dreamer `oldid=2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`.
- Official Vortox `oldid=3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`.
- Official Mathematician `oldid=3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`.
- Official States `oldid=1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`.
- Official Abilities `oldid=1376`, SHA-256 `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`.
- Official nightsheet pinned at repository main `915347e627c3f6cd1f438f82b6001784e11b3e8b` and file commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, identical SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`, SHA-256 `c7961361455c4a2b05a725a8802d875664082c32aa9da27ef813c5d6ed012b44`.

Independent rule conclusions:

- Dreamer must learn exactly one native GOOD character and one native EVIL character; normally one is the target's true character.
- With an effective living Vortox, Townsfolk information must be false; for Dreamer neither displayed character may equal the target's true character. Targeting the current Vortox is legal and is explicitly illustrated by the official and Chinese sources.
- Drunk or poisoned players have no ability. Source DRUNK therefore remains an effectiveness-precedence boundary; this Slice correctly does not implement source-impaired delivery.
- A Vortox-caused false Dreamer result is one Dreamer player's abnormal ability result caused by another character, so existing Mathematician consumption counts the Dreamer source once, not once per false field.
- Nightsheet: first night has 80 entries—Clockmaker `60/80`, Dreamer `61/80`, Seamstress `62/80`, Mathematician `77/80`, and no Vortox wake. Other night has 99 entries—Vortox `47/99`, Dreamer `79/99`, Mathematician `96/99`.
- No substantive external-rule conflict was found.

## productionAndTestContractsInspected

Governance, architecture, status, and handoff:

- `AGENTS.md`
- the complete ordered chain from `project-handoff/00-README-FIRST.md`
- `project-handoff/rules/11-drunk-and-poison.md`
- `project-handoff/rules/12-information-model.md`
- `project-handoff/rules/18-sects-and-violets-roles.md`
- `project-handoff/rules/19-sects-and-violets-demons.md`
- `project-handoff/tests/25-rule-test-cases.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- current `AUTOPILOT_STATE`, `CURRENT_TASK`, `PROJECT_STATE`, and role coverage matrix.

Production contracts:

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- relevant event, state, applier, and rebuild contracts
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

Test/support contracts:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- existing Dreamer accepted-stream harness and immutable fixture contracts.

## findings

### 1. BLOCKER — the frozen ten-entry ledger evidence set is impossible for the legal target-current-Vortox case

- severity: `BLOCKER`
- file/symbol:
  - `docs/implementation/phase-3-slice-2b19a3a-design.md:353-385`
  - criteria `2B19A3A-C20` and support matrix `2B19A3A-S02`
  - completion criterion 13
  - `packages/domain-core/src/first-night-ability-outcome-ledger.ts:208-220,320-338,673-677`
  - `canonicalizeAbilityOutcomeEvidenceReferences`, `primary`, and Dreamer evidence derivation
- failureScenario:
  - The design requires exactly three `PLAYER_ROLE_AT_REVISION` entries: Dreamer source, target, and Vortox, and therefore exactly ten total evidence entries for every accepted V3 fact.
  - Dreamer is legally allowed to target the current Vortox. The official and Chinese rule examples explicitly use Dreamer targeting Vortox.
  - In that legal case, “target” and “Vortox” are the same player at the same evaluated character-state revision. The existing primary identity for `PLAYER_ROLE_AT_REVISION` is exactly `${playerId}@revision-${characterStateRevision}`.
  - The existing canonicalizer sorts and deduplicates adjacent entries with the same kind and primary identity; byte-identical target/Vortox role evidence therefore coalesces into one entry.
  - The canonical legal fact has nine entries, not ten: source event, task, opportunity, two role tenures, character state, two player-role-at-revision entries (source plus target/Vortox), and Dreamer delivery.
  - Forcing ten would require changing existing evidence uniqueness semantics, adding a new evidence discriminator/variant, or illegally excluding Vortox as a target. All three contradict the frozen scope and/or BOTC rules.
- requiredCorrection:
  - Round 2 must freeze a closed conditional cardinality: nine entries when the target is the proven current Vortox, ten otherwise, or an equivalent exact contract using only the unchanged evidence union and canonicalizer.
  - The fact validator must treat the coalesced target/Vortox role proof as satisfying both positive identities while still requiring exactly one active Vortox tenure, zero impairment evidence, truth excluded from both delivered roles, and exact canonical source derivation.
  - Update `ledgerWithoutNewEvidence`, `C20`, `S02`, completion criterion 13, and every exact-cardinality statement consistently.
- requiredRegressionTests:
  - A real accepted EVIL target where the target is the current Vortox derives exactly one abnormal Vortox fact with the canonical nine-entry set.
  - A legal non-Vortox EVIL target derives the canonical ten-entry set.
  - Removing, substituting, duplicating, conflicting, adding, or reordering entries in both the nine-entry and ten-entry closed sets rejects.
  - The target/Vortox coalescence does not weaken exact current-Vortox player, role, revision, or active-tenure validation.
  - No new evidence variant or impairment-absence record is added.

### 2. BLOCKER — the authority table does not satisfy the mandatory reachability, trust, and primary-layer contract

- severity: `BLOCKER`
- file/symbol:
  - `docs/implementation/phase-3-slice-2b19a3a-design.md:38-75,430-471`
  - criteria `C01`, `C09`, `C10`, `C17`, `C18`, `C20`, `C22-C30`
  - `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md:47-54,221-235`
  - `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md:172-213`
- failureScenario:
  - The ADR requires every behavior row and test claim to name exactly one primary reachability class and every test to name exactly one primary layer. The Slice traceability table must record criterion, rule claim, reachability, trust level, primary test, exact primary layer, supporting tests, and expected failure.
  - The design's table contains only ID, assertion, free-form “Primary authority layer,” and primary file. It omits per-row R class, T class, rule claim, supporting tests, and expected failure.
  - Many layer strings are not one of the seven closed ADR values. Examples include `accepted-stream replay validation`, `accepted stream plus historical projection`, `hostile/pure seam`, `accepted application failure/recovery`, `accepted-stream ledger integration`, `accepted-stream consumer integration`, `projection security`, and `nightsheet structural validation`.
  - Several criteria combine claims from different reachability classes or test layers. `C01` bundles shape, replay, ledger, and projection; `C10` bundles a pre-resolution accepted change with a post-delivery change; `C27` combines state-only rejection and accepted-stream acceptance.
  - `C10` is materially wrong: governance explicitly classifies post-delivery character-change production as R4/out of scope. No current accepted producer can create that later change, and state-only projection must reject V3, so the “later change does not rewrite history” half cannot be claimed as accepted-stream authority.
  - `C17` selects an undefined compound layer (`hostile/pure seam`) instead of one primary layer. Similar compound/free-form labels prevent the required static traceability audit from determining what actually proves each claim.
- requiredCorrection:
  - Round 2 must include a complete standalone traceability table for every C/S claim with exactly one `R1`, `R2`, `R3`, or `R4` primary reachability class; exactly one `T1`, `T2`, or `T3` trust class; one exact ADR primary-layer token; primary test; supporting tests; rule claim; and expected success/failure.
  - Use only `ACCEPTED_STREAM_INTEGRATION`, `LEGACY_REPLAY_COMPATIBILITY`, `HOSTILE_REPLAY_REJECTION`, `STRUCTURAL_VALIDATION`, `PURE_POLICY_SEAM`, `PROJECTION`, or `CROSS_PLATFORM_CI`.
  - Split composite criteria when their claims require different reachability classes or primary layers.
  - Preserve the pre-resolution character-change accepted proof only if a real accepted producer is named and exercised. Classify post-delivery historical immutability as `R4 / PURE_POLICY_SEAM` or explicitly defer it; do not label it accepted stream.
  - Classify the positive non-circular complete-batch replay proof under one exact allowed layer; classify hostile mutations separately under `R3 / HOSTILE_REPLAY_REJECTION`.
  - Map accepted application/ledger/Mathematician flows to `ACCEPTED_STREAM_INTEGRATION`, projection claims to `PROJECTION`, nightsheet structure to `STRUCTURAL_VALIDATION`, and exact-head platform gates to `CROSS_PLATFORM_CI`.
- requiredRegressionTests:
  - Static traceability validation fails if any criterion lacks one R class, one T class, one exact primary layer, a primary test, supporting-test declaration, rule claim, or expected result.
  - Static validation fails on compound or unknown layer names.
  - No manually constructed R3/R4 state is labeled accepted-stream integration.
  - Post-delivery character-change stability is tested only as an honest R4/pure seam or deferred until a real accepted producer exists.
  - Accepted source-DRUNK remains R1 reachable but explicitly unsupported; source POISONED and impaired-Vortox paths remain R4 pure seams.

### 3. MAJOR — the test/support allowlist is not closed enough for the claimed static scope gate

- severity: `MAJOR`
- file/symbol:
  - `docs/implementation/phase-3-slice-2b19a3a-design.md:473-496`
  - support claim `2B19A3A-S04`
- failureScenario:
  - The seven primary test files are enumerated, but the additional phrase “existing adjacent test-harness fixture files only when required” does not identify exact paths and leaves “adjacent” and “required” to implementation-time judgment.
  - `S04` simultaneously claims that exact production/test/control allowlists can be statically checked. An open-ended category cannot be compared against an exact diff allowlist, so the frozen design does not determine whether the known accepted-stream harness and JSON fixture may or may not change.
- requiredCorrection:
  - Round 2 must enumerate every permitted existing harness/fixture path exactly, or state that none may change. If new support files are permitted, freeze their exact directory, naming contract, purpose, and maximum count.
  - Keep the five-file production allowlist and `<=1000` added production LOC ceiling unchanged.
- requiredRegressionTests:
  - `S04` compares the diff against one closed path set and rejects any unlisted test, harness, fixture, workflow, dependency, configuration, or production file.
  - The immutable accepted-stream capture must demonstrate whether it is regenerated, byte-compared, or read-only without granting an implicit broad fixture exception.

No independent `MINOR` finding remains after the three issues above.

## scopeAndStopLoss

- External rule semantics are correct and conflict-free; `HUMAN_BLOCKED` is not required at Round 1.
- The archived 2B19A3 design remains stopped. This review covers only resliced 2B19A3A and does not authorize a hidden 2B19A3 Round 3.
- The design correctly keeps source DRUNK reachable but unsupported and defers source-impaired delivery to 2B19A3B.
- The design correctly requires positive effective-Vortox proof from complete canonical T2 state and does not introduce caller-supplied absence evidence.
- The complete-batch-prefix plus event-applier pre-delivery proof is non-circular: `DreamerTargetChosen` changes none of the character, tenure, impairment, or catalog facts used to prove Vortox applicability. The design does not treat an illegal partial batch as accepted history.
- V3 stored validation remains shape/cross-link only; state-only player/AI projection rejects V3, while accepted-stream projection may expose it only after full replay.
- V1/V2 event, replay, ledger, projection, and receipt semantics remain additive and unchanged.
- GOOD/EVIL native-type classification and double truth exclusion are correctly frozen. In-play false roles remain legal.
- The existing ledger evidence vocabulary is sufficient if the legal target/Vortox identity collision is modeled honestly; no new evidence kind is required.
- Existing Mathematician production is unchanged and the Dreamer source is counted once.
- The exact three-event target/delivery/settlement batch, prospective validation, retryable-failure/no-receipt boundary, and actor-safe error rules are otherwise sufficiently frozen.
- The proposed five production files and 700–950 LOC estimate remain under the binding five-file/1000-LOC ceiling. The identified corrections do not require a new event type, GameState field, public resolver/context, projection field, generic effect platform, or sixth production file.
- Implementation remains unauthorized. Round 2 may correct only the frozen evidence-cardinality, authority-traceability, and closed allowlist contracts. If those corrections require broader rule semantics or infrastructure, apply the existing reslice/HUMAN_BLOCKED stop condition.

## verdict

`RULE_DESIGN_FIX_REQUIRED`

## remainingBlockers

1. Replace the impossible unconditional ten-entry Dreamer V3 evidence contract with an exact legal nine/ten-entry contract that handles target=current Vortox without changing evidence identity semantics.
2. Supply the ADR-complete per-claim reachability/trust/primary-layer traceability matrix and correct the post-delivery character-change and compound-layer classifications.
3. Close the test/support path allowlist so `S04` can enforce the frozen diff scope exactly.

RULE_DESIGN_FIX_REQUIRED
