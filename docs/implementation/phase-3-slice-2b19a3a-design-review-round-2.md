# Phase 3 Slice 2B19A3A — Independent Rule Design Review Round 2

## reviewedArtifacts

- reviewedDesign: `docs/implementation/phase-3-slice-2b19a3a-design-round-2.md`
- reviewedDesignSha256: `a3059ff3d3bd9011df19660123139fbbd890a8da549a00c07ac09a65db04a172`
- reviewedEvidence: `docs/rules/evidence/2B19A3A.md`
- reviewedEvidenceSha256: `2da6b7c9d6fea31bbab05674ac3e6a45213257c7af314f66d47eb4a8436f84b6`
- reviewedGovernance: `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md`
- reviewedGovernanceSha256: `ccb73944855c4eb110335462aba32865cb5dbd357db2733dfae6e2b1980426f9`
- reviewedRound1Design: `docs/implementation/phase-3-slice-2b19a3a-design.md`
- reviewedRound1DesignSha256: `fb9dc655ba718030dde3208f2a3f3fc51e9582fcef0f3b2db4cccbaabfa9c794`
- reviewedRound1Review: `docs/implementation/phase-3-slice-2b19a3a-design-review-round-1.md`
- reviewedRound1ReviewSha256: `3d7d4a2c18195bf7755753c96b82b11a86a5e868b9af3c4e66bbd8df24d4a892`
- reviewIdentity: independent read-only reviewer
- designRound: `2 / 2`
- implementationAuthorized: `false`

## sourcesIndependentlyRead

The reviewer independently retrieved and read the live pinned sources on 2026-07-17; it did not rely only on the rule-researcher summary, repository tests, README files, or model memory.

- `docs/rules/USER_OVERRIDES.md`
- Chinese Wiki homepage, oldid 5855, SHA-256 `2a26...ddb49`
- Chinese Wiki Dreamer, oldid 3046, SHA-256 `53ca...acfdf7`
- Chinese Wiki Vortox, oldid 6198, SHA-256 `3671...3608ff`
- Chinese Wiki Mathematician, oldid 6214, SHA-256 `171f...8feb6e`
- Official BOTC Wiki Dreamer, oldid 2904, SHA-256 `8841...a4a7c`
- Official BOTC Wiki Vortox, oldid 3017, SHA-256 `4630...5cf07`
- Official BOTC Wiki Mathematician, oldid 3109, SHA-256 `a4a6...2f33e8b`
- Official BOTC Wiki States, oldid 1039, SHA-256 `9d99...31d440`
- Official BOTC Wiki Abilities, oldid 1376, SHA-256 `7cc7...79b40`
- Official nightsheet at pinned commit `3d6d...`, SHA-256 `99a2...c3f75`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`

The sources agree for this Slice: Dreamer learns one native GOOD and one native EVIL character; while an effective Vortox is in play, Townsfolk information must be false, so a V3 Dreamer pair excludes the target's settlement-time true character from both slots. The Mathematician interaction counts the affected Dreamer source player once. Official first-night order remains Clockmaker 60/80, Dreamer 61/80, Seamstress 62/80, with no Vortox first-night wake entry; other-night order places Vortox before Dreamer. No material source conflict was found.

## productionAndTestContractsInspected

Production contracts independently inspected:

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- current event, event-applier, game-state, rebuild, opportunity, and Mathematician linkage that the design explicitly leaves unchanged

Test and accepted-history contracts independently inspected:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- the existing Dreamer V3 accepted-stream harness and immutable fixture patterns

The review covered exact runtime shapes, V1/V2 replay stability, V3 atomic three-event batches, pre-delivery non-circular Vortox applicability proof, prospective validation, retry/receipt boundaries, historical knowledge stability, player/AI information isolation, deterministic role selection, exact evidence canonicalization, Mathematician counting, projection boundaries, night order, negative tests, closed affected-file allowlists, production-size limits, and claimed CI execution.

## findings

### Closed Round 1 blockers

1. The ledger contradiction is closed. The Round 2 design now requires the exact nine-entry abnormal fact when the target is the current Vortox and the exact ten-entry fact otherwise; it does not require an impossible duplicate canonical character-tenure identity.
2. Mechanical traceability completeness is closed. The design contains 53 primary and 39 supporting rows with unique IDs and unique rule claims, all eight required columns populated, and only the seven permitted primary-layer tokens.
3. The implementation boundary is closed. The exact production/test/document allowlists and the maximum three exact new harness paths remove the prior open-ended file surface; the three accepted baseline harness paths remain immutable.

### BLOCKER — R3 failure and mutation scenarios are mislabeled as accepted-stream integration

- severity: `BLOCKER`
- file/symbol: `docs/implementation/phase-3-slice-2b19a3a-design-round-2.md`, Primary claims C27-C32 (lines 457-462) and `STATIC_REACHABILITY_LABEL_AUDIT` / S37 (lines 525 and 529)
- failureScenario: C27-C32 are all labeled `R3` while their primary layer is `ACCEPTED_STREAM_INTEGRATION`. The frozen governance contract states that only R1 may be called accepted-stream integration, and the user's reslice authorization explicitly forbids labeling manual mutations as accepted stream. C29's analogous existing test mutates the private `createBatch` path to forge a prospective-validation failure, so it is not an accepted producer path. C27/C28 describe unresolved capability/catalog states rather than accepted canonical history. C30 is an injected unexpected prospective failure. C31/C32 are live command-path metadata/append failures if tested through real adapters and therefore must be R1 if the accepted-stream layer is retained; otherwise their primary layer must honestly identify the non-accepted fault-injection seam. S37 is self-referential because it only compares rows to the same frozen matrix and therefore fails to reject this forbidden R3-plus-accepted-stream combination.
- requiredCorrection: No correction is authorized inside the exhausted 2/2 design budget. A separately authorized reslice must classify each row by the test's actual primary path: R3 hostile/structural/pure-policy coverage must use the corresponding non-accepted layer; a real live command-path metadata or append failure may retain `ACCEPTED_STREAM_INTEGRATION` only when classified R1; no manual/private mutation may claim accepted-stream authority. The static reachability audit must independently reject every `ACCEPTED_STREAM_INTEGRATION` row whose reachability is not R1 and must reject manual-mutation tests presented as accepted-stream evidence.
- requiredRegressionTests: In the next authorized reslice, add a deterministic schema/reachability audit that fails on an R3/R4 plus `ACCEPTED_STREAM_INTEGRATION` row; prove any retained R1 failure case starts from the real application command path and accepted pre-event state; separately identify every fault-injection/manual mutation test as non-accepted evidence. Keep receipt-free, zero-event, OPEN-opportunity retry assertions for every pre-commit failure and the successful same-command-ID retry after dependency repair.

No additional rule-semantic blocker was found. The nine/ten evidence sets, no new impairment evidence, GOOD/EVIL native-type constraints, double exclusion of settlement-time truth, pre-event absence proof, state-only validator limitation, V3 accepted-stream-only projection, source DRUNK deferral, source POISONED/effective-Vortox classifications, V1/V2 stability, deterministic selection, atomicity, secrecy, Mathematician single-player counting, five-file production cap, and `<=1000` added production LOC are otherwise coherently frozen.

## scopeAndStopLoss

- This review does not authorize implementation, branch publication, PR creation, or production/test edits.
- Design Round 2 is the final authorized design round (`2 / 2`).
- No Design Round 3 may be inferred.
- Because a design blocker remains after 2/2, the controller must transition the Slice downstream to `HUMAN_BLOCKED` and `RESLICE_REQUIRED`.
- Any future correction requires explicit new user authorization and a newly bounded slice; it must not silently resume 2B19A3A implementation.
- 2B19A3B and later Dreamer/Vortox semantics remain out of scope.
- Delivery to the implementer was attempted twice but the collaboration runtime returned `agent thread limit reached`; the controller or sole writer must materialize this exact report without alteration.

## verdict

- verdict: `RULE_DESIGN_FIX_REQUIRED`
- remainingBlockers:
  - `R3_ACCEPTED_STREAM_PRIMARY_LAYER_MISCLASSIFICATION_C27_C32`
- downstreamControllerStatus: `HUMAN_BLOCKED`
- requiredNextAction: `RESLICE_REQUIRED`

RULE_DESIGN_FIX_REQUIRED
