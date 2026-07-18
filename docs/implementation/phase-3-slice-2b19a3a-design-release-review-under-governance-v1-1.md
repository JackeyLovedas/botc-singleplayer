# Phase 3 Slice 2B19A3A — Design Release Review Under Governance Traceability V1.1

## reviewIdentity

- reviewerRole: `independent read-only release reviewer`
- reviewTimestamp: `2026-07-17T16:29:20.4298941+08:00`
- reviewedHead: `8d70147264c3cc839aa369257ea47ba4cf4b5e10`
- reviewedBranch: `phase-3/dreamer-vortox-effective-source`
- authorization: `USER_AUTHORIZED_GOVERNANCE_TRACEABILITY_V1_1_APPLICATION_COMMAND_LAYER`
- reviewKind: `classification-only release review of immutable Round 3 under accepted Governance Traceability V1.1`
- designRound: `3 / 3`
- designRound4Created: `false`
- implementationStarted: `false`

## governanceAcceptance

- governanceDecision: `ENGINEERING-GOVERNANCE-TRACEABILITY-V1.1`
- governancePR: `#35` — `https://github.com/JackeyLovedas/botc-singleplayer/pull/35`
- governanceFeatureHead: `dbee2f3e1a6e88dd8580ea2d5820dd65bffe0a43`
- independentGovernanceCodeVerdict: `CODE_REVIEW_PASS`
- independentGovernanceRuleVerdict: `RULE_REVIEW_PASS`
- governanceReviewBlockers: `[]`
- governanceMergeSha: `8d70147264c3cc839aa369257ea47ba4cf4b5e10`
- governanceMergedAt: `2026-07-17T08:16:12Z`
- acceptedTag: `governance-application-command-integration-layer-v1-1`
- exactMergeHeadCI: `29565845242 / SUCCESS`
- exactMergeHeadCIUrl: `https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29565845242`
- exactMergeHeadCIScope: Ubuntu typecheck, lint, full tests and coverage; Windows deterministic suite
- localHeadEqualsOriginMain: `true`
- worktreeAtReview: `CLEAN`
- openPRsAtReview: `0`

The merged PR, two complete exact-head independent PASS comments, accepted tag, and successful exact merge-head CI establish V1.1 acceptance. The ADR's branch-era sentence and metadata value `PROPOSED_PENDING_INDEPENDENT_REVIEW` are preserved historical feature-branch wording; they do not override the later merge, tag, review, and CI evidence and do not reopen the governance PR.

## reviewedArtifacts

Canonical document hashes below normalize checkout CRLF to LF where the immutable design metadata uses LF hashes.

| Artifact | SHA-256 |
|---|---|
| `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md` | `dc46a47510a0ea233367a008fc1dba44b2dcdc4bf61737e78a88052226abd628` |
| `docs/agent-loop/REVIEW_PROTOCOL.md` | `4f9328a73172e4a70f8ef64be431a55e23f96bb78e553673d3aef0845ea00b64` |
| `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md` | `ccb73944855c4eb110335462aba32865cb5dbd357db2733dfae6e2b1980426f9` |
| `docs/implementation/phase-3-slice-2b19a3a-design-round-3.md` | `ff191fe9b0877b9fc613fb0f98341fa757a19019918f83b875d564d5e8a91b57` |
| `docs/implementation/phase-3-slice-2b19a3a-design-review-round-3.md` | `fb98868d6953dd8a686f18e75532a19a519e599273496c5e2947cb181133ec69` |
| `docs/rules/evidence/2B19A3A.md` | `7c427b38240ef888e7b9851b5c8ce9a67377224722be01fa8f3154e5f731a7eb` |
| `docs/rules/USER_OVERRIDES.md` | `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624` |
| `docs/rules/ROLE_COVERAGE_MATRIX.md` | `c7961361455c4a2b05a725a8802d875664082c32aa9da27ef813c5d6ed012b44` |
| `packages/application/src/game-application-service.ts` | `119b1e92ac8abc7a02f9d29423779862d4febb803ae92f542f933eb835b9e8d5` |
| `packages/application/src/game-application-service.test.ts` | `a17f45e198b51880fb3295b49b9261e939a276a2e631bf390c8520514bb30421` |
| `packages/application/src/ports/command-commit-store.ts` | `f6e0d0321997d0415724f3c7ddcb769bcf74ad457f16bc40ac1167ba9372238c` |
| `packages/test-harness/src/memory-stores.ts` | `8be14f34cca57a68bbc3508ce02020065e667ff8db9fde6627dcf15fa3335be1` |
| `packages/domain-core/src/dreamer.ts` | `5adc4ff8719d596b1a1659e77c2f7124ed4449133e31af8bf45e08cf51851725` |
| `packages/domain-core/src/domain-batch-semantics.ts` | `9379a86ec34f996d92d92558abf15d9567ed366d2bac744ee0620b6844564047` |
| `packages/domain-core/src/first-night-ability-outcome-ledger.ts` | `b9f7191d2aa94129b155195896154c2de03d6d5fecc67121315bf24599426ea0` |
| `packages/projections/src/index.ts` | `bf666709bda2128f130ffad247e2d682bb0cd8a64591f5b2cb4a329454b3936f` |

The reviewer also read the complete immutable Round 3 design/review history, the application execute path, command commit port, existing fault-injecting ID/clock and commit-store tests, prospective-validation tests, and the allowed production/test surfaces. No 2B19A3A implementation or physical C17/C27-C32 test exists yet.

## independentRuleVerification

The reviewer independently re-read the pinned external sources, not only the rule-research summary:

- Official Dreamer oldid `2904`;
- Official Vortox oldid `3017`;
- Official Mathematician oldid `3109`;
- Official States oldid `1039`;
- Official Abilities oldid `1376`;
- Chinese 筑梦师 oldid `3046`;
- Chinese 涡流 oldid `6198`;
- Chinese 数学家 oldid `6214`;
- official pinned nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`.

Retrieved hashes match the rule evidence: Chinese Dreamer `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`, Chinese Vortox `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`, Chinese Mathematician `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`, official Mathematician `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`, official States `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`, official Abilities `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`, and nightsheet `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

The sources continue to establish: Dreamer yields one GOOD and one EVIL character; effective Vortox forces Townsfolk information false, including apparent information to drunk/poisoned Townsfolk; for Dreamer forced-false both shown characters exclude the target's actual character; Vortox-caused abnormal Dreamer information qualifies the Dreamer player once for Mathematician; Dreamer remains `61/80`, Vortox has no first-night wake entry, and no relevant conflict or override exists. Rule evidence remains `RULE_READY / PARTIAL`.

## releaseReviewBasis

Governance V1.1 makes entry path and main assertion authoritative and makes setup alone non-authoritative. It adds `APPLICATION_COMMAND_INTEGRATION` without weakening the other layers:

- successful full command, producer, accepted events, receipt, append, rebuild, and projection: `R1 / ACCEPTED_STREAM_INTEGRATION`;
- real formal application rejection or dependency/prospective/metadata/append/commit/receipt failure with no commit or atomic rollback: normally `R1 / APPLICATION_COMMAND_INTEGRATION`;
- accepted prefix followed by manually tampered persisted/imported history rejected by replay/rebuild: `R3 / HOSTILE_REPLAY_REJECTION`;
- direct payload/parser/shape/version/ID/field validator: `R3 / STRUCTURAL_VALIDATION`.

Round 3's planned physical test titles, private test seams, and provisional supporting-test names are not behavior design under V1.1. The frozen authority is the criterion, expected result, required evidence mechanism, reachability, trust, primary layer, and supporting-authority requirement. This review changes only the primary-layer/reachability mapping required by the newly accepted vocabulary; it does not alter any criterion, expected result, rule, behavior, API, payload, event, provenance, ledger, projection, receipt, allowlist, size, or coverage contract.

## correctedCriterionClassifications

| Criterion | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult |
|---|---|---|---|---|---|---|
| `C17` | accepted source DRUNK remains explicitly unsupported | Invoke the real `GameApplicationService.execute(SubmitDreamerAction)` from a real accepted Philosopher-created DRUNK-base-Dreamer V3-OPEN prefix; assert the application capability rejection and all store outcomes | `R1` | `T2` | `APPLICATION_COMMAND_INTEGRATION` | `ApplicationNotConfigured / first-night-role-action / no receipt / zero events / unchanged version / OPEN` |
| `C27` | unresolved capability is receipt-free and retryable | Invoke the real `GameApplicationService.execute(SubmitDreamerAction)` from an accepted V3-OPEN prefix with a bounded capability-resolution failure injection; assert the formal application result and unchanged store/state. Do not directly call a validator and do not mutate persisted history | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | exact `DependencyExecutionFailed / first-night-role-action / no receipt / zero events / unchanged version / OPEN` |
| `C28` | candidate/canonical-result dependency failure is receipt-free and retryable | Invoke the real application command from an accepted V3-OPEN prefix with bounded candidate/construction failure injection; assert the formal application result and unchanged store/state. C20 remains the separate `R3/T3/PURE_POLICY_SEAM` shortage claim | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | exact `DependencyExecutionFailed / first-night-role-action / no receipt / zero events / unchanged version / OPEN` |
| `C29` | prospective Dreamer `DomainError` preserves actor-safe failure and stage | Invoke the real application command and inject a proposed-batch prospective `DomainError` before commit; assert no persisted mutation, receipt, version change, or opportunity closure | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `DependencyExecutionFailed / first-night-role-action / no receipt / zero events / unchanged version / OPEN` |
| `C30` | unexpected prospective non-`DomainError` is contained and preserves stage | Invoke the real application command and inject an unexpected prospective failure before commit; assert generic actor-safe failure and unchanged store/state | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `DependencyExecutionFailed / prospective-validation / no receipt / zero events / unchanged version / OPEN` |
| `C31` | every batch/event-ID or clock metadata failure is atomic and retryable | Invoke the real application command using the real injected `IdGenerator`/`Clock` dependencies; fail each metadata position and assert formal result plus unchanged store/state | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `MetadataGenerationFailed / event-metadata / no receipt / zero events / unchanged version / OPEN` |
| `C32` | before-commit and during-commit store failure are atomic and retryable | Invoke the real application command using `CommandCommitStore.commitAcceptedCommand` failure injection (`failBeforeCommit` and `failDuringCommit`); assert no accepted events, no receipt, unchanged version/state, and OPEN opportunity | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `EventStoreAppendFailed / accepted-commit / no receipt / zero accepted events / unchanged version / OPEN` |

### mechanismConclusions

- `C17`: its main assertion is an application-level unsupported rejection. It is not successful accepted-stream integration.
- `C27`: its required evidence is a reachable formal-command capability-dependency failure. The historical direct-private-preflight title/seam is non-binding. A passing implementation must execute the formal entry and bounded failure injection; a direct private validator would instead be `R3 / STRUCTURAL_VALIDATION` and would fail `MechanismMatch`.
- `C28`: its application dependency-failure criterion is distinct from C20's pure hostile/substituted-catalog shortage policy claim.
- `C29` and `C30`: an ephemeral fault-injected proposed batch that fails prospective validation before persistence is an application-command failure, not hostile persisted replay. If an implementation instead manually persists a tampered event and rebuild rejects, that different test is `R3 / HOSTILE_REPLAY_REJECTION` and cannot satisfy these criteria.
- `C31`: metadata adapter failure through the real command is application-command integration, not direct structural validation.
- `C32`: real commit-store failure through `commitAcceptedCommand` is application-command integration, not structural validation and not hostile replay.
- `C33` remains independently `R1 / T1 / ACCEPTED_STREAM_INTEGRATION` because recovery success is its main assertion and it completes the accepted command chain.
- C21-C26 and hostile settlement/history mutations remain `R3 / HOSTILE_REPLAY_REJECTION`; S01-S10 remain direct `R3 / STRUCTURAL_VALIDATION`. No R3 path is relabeled R1.

## supportingAuthorityPlan

Design-time authority is exactly `PLANNED_SUPPORTING_AUTHORITY`; final physical title, file line, fixture ID, and `SUP-*` identifier are intentionally not frozen before implementation.

1. `PLANNED_SUPPORTING_AUTHORITY_DRUNK_OPEN_PREFIX`

   - Producer: real accepted `GameApplicationService` commands, including the accepted Philosopher choice that makes the base Dreamer DRUNK and the real V3 opportunity opening.
   - Expected status: `ACCEPTED`.
   - Mutation expectation: `NONE`.
   - Used by: `C17`.

2. `PLANNED_SUPPORTING_AUTHORITY_EFFECTIVE_VORTOX_OPEN_PREFIX`

   - Producer: real accepted `GameApplicationService` commands reaching the effective-base-Dreamer/effective-current-Vortox V3-OPEN opportunity.
   - Expected status: `ACCEPTED`.
   - Mutation expectation: `NONE`; C27-C32 fault injection must not mutate the persisted supporting prefix.
   - Used by: `C27`, `C28`, `C29`, `C30`, `C31`, `C32`, and may support `C33` without becoming its primary authority.

At implementation time these plans must receive unique `SUP-2B19A3A-NNN` IDs resolving exactly once, with Producer, SourceTestOrFixture, AuthorityStatus, UsedByCriteria, and MutationDisposition. Every C row must also bind `ActualTestFile`, `ActualTestTitle`, `ActualPrimaryLayer`, `ActualReachability`, `ActualTrust`, `SupportingAuthorityId`, and semantic `MechanismMatch`. Supporting authority never determines the primary layer and never substitutes for the formal-entry primary test.

## priorBlockerDisposition

1. `C27_C32_PRIMARY_LAYER_MECHANISM_MISMATCH`: `CLOSED`.

   - V1.1 supplies the missing formal layer. C27-C32 are reachable formal application failures and are classified `R1 / APPLICATION_COMMAND_INTEGRATION` when proven through `execute` plus the required failure injection. Direct validators and persisted tampering remain separately classified and cannot satisfy these rows.

2. `C17_FAILURE_PRIMARY_ACCEPTED_STREAM_MISCLASSIFICATION`: `CLOSED`.

   - C17 is `R1 / T2 / APPLICATION_COMMAND_INTEGRATION`; accepted DRUNK setup is supporting authority, while the application rejection is primary.

3. `ACCEPTED_PREFIX_SUPPORTING_AUTHORITY_NOT_UNIQUELY_TRACEABLE`: `CLOSED_AT_DESIGN_TIME`.

   - Governance V1.1 expressly permits `PLANNED_SUPPORTING_AUTHORITY` before implementation. The two plans above are unambiguous; final unique IDs and physical bindings are mandatory implementation-time gates, not missing design behavior.

4. `ROUND3_CORRECTION_AUTHORITY_METADATA_INCOMPLETE`: `CLOSED_BY_AUTHORIZED_RELEASE_REVIEW_PROVENANCE`.

   - Immutable Round 3 is not rewritten. This review records the exact current authorization, accepted Governance V1.1 PR/head/reviews/merge/tag/CI, Round 3 and Round 3 review hashes, classification-only scope, and unchanged-design flags. No Design Round 4 is inferred or created.

## unchangedContracts

- behaviorDesignChanged: `false`
- ruleSemanticsChanged: `false`
- publicApiChangedByReview: `false`
- eventSchemaChanged: `false`
- payloadSchemaChanged: `false`
- provenanceModelChanged: `false`
- ledgerSchemaChanged: `false`
- ledgerEvidenceKindAdded: `false`
- negativeAbsenceEvidenceStored: `false`
- projectionContractChanged: `false`
- receiptContractChanged: `false`
- candidatePolicyChanged: `false`
- acceptedStreamPreStateProofChanged: `false`
- V1V2CompatibilityChanged: `false`
- productionAllowlistChanged: `false`
- testAllowlistChanged: `false`
- coverageChanged: `false`
- sourceImpairmentImplemented: `false`
- phase2CStarted: `false`

Round 3 behavior remains the sole product design: effective base Dreamer plus effective current Vortox only; one native GOOD and one native EVIL character, both excluding settlement-time truth; exact atomic target V2/delivery V3/settlement; canonical pre-delivery Vortox proof; positive facts only; unchanged nine/ten-entry closed evidence union; one `ABNORMAL / VORTOX_FALSE_INFORMATION` fact; existing Mathematician counts the Dreamer source once; accepted-stream-only private projection; unchanged retry/idempotency and V1/V2 history. Source impairment information, impaired Vortox, No Dashii, gained Dreamer, other-night, FIRST_NIGHT completion, DAY, 2B19A3B, 2B19B, and Phase 2C remain out of scope.

## findings

`[]`

## implementationReleaseConditions

This release review does not itself implement or test the Slice. Implementation is authorized only against the immutable Round 3 behavior plus the classification mapping in this report. Final implementation traceability must prove every criterion through the specified mechanism and V1.1 actual bindings.

Any of the following invalidates this release pass and requires the applicable governed response: C17/C27-C32 bypasses the formal application entry; a direct validator is claimed as application integration; manually tampered persisted history is claimed R1; the actual test does not prove no event/no receipt/version/state/OPEN outcomes; a new public port/trust boundary is introduced; behavior, rule, schema, provenance, ledger, projection, receipt, allowlist, size, or coverage contracts change; a supporting authority remains unresolved or ambiguous; or `MechanismMatch` is not `PASS`.

## verdict

- verdict: `DESIGN_RELEASE_PASS`
- behaviorDesignChanged: `false`
- ruleSemanticsChanged: `false`
- schemaChanged: `false`
- classificationBlockersClosed: `true`
- implementationAuthorizedByReleaseReview: `true`
- designRound4Required: `false`
- remainingBlockers: `[]`

DESIGN_RELEASE_PASS
