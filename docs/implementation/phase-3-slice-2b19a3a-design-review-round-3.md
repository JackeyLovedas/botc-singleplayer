# Phase 3 Slice 2B19A3A — Independent Classification-Only Rule Design Review Round 3

## reviewedArtifacts

- reviewIdentity: `fresh independent read-only reviewer`
- reviewTimestamp: `2026-07-17T15:17:52.7674526+08:00`
- reviewedAuthorization: `USER_AUTHORIZED_2B19A3A_CLASSIFICATION_ONLY_DESIGN_CORRECTION_ROUND_3`
- reviewedAuthorizationAttachmentSha256: `bda71ce814099bb922de31d5e29f0d69588c3c1b2adbd79dc0bc1c9ad8a20b05`
- reviewedHead: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- reviewedBranch: `phase-3/dreamer-vortox-effective-source`
- reviewedOriginMain: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- openPRs: `[]`
- reviewedADR: `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- reviewedADRSha256: `4b388e91b897de37139cd0b5c28bc744ac35ef8600d7b1350eb9b4d61ff57b9b`
- reviewedProtocol: `docs/agent-loop/REVIEW_PROTOCOL.md`
- reviewedProtocolSha256: `ec9dad7ced61bafa6f1b6b577124237255b72aa2514ed9e4184906eebd9a240d`
- reviewedGovernance: `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md`
- reviewedGovernanceSha256: `ccb73944855c4eb110335462aba32865cb5dbd357db2733dfae6e2b1980426f9`
- reviewedRound2Design: `docs/implementation/phase-3-slice-2b19a3a-design-round-2.md`
- reviewedRound2DesignSha256: `a3059ff3d3bd9011df19660123139fbbd890a8da549a00c07ac09a65db04a172`
- reviewedRound2Review: `docs/implementation/phase-3-slice-2b19a3a-design-review-round-2.md`
- reviewedRound2ReviewSha256: `51defb79e2df640f666fb4a702668a5652678a31b590526e79afddf38c3ad8d1`
- reviewedEvidence: `docs/rules/evidence/2B19A3A.md`
- reviewedEvidenceSha256: `7c427b38240ef888e7b9851b5c8ce9a67377224722be01fa8f3154e5f731a7eb`
- reviewedRound3Design: `docs/implementation/phase-3-slice-2b19a3a-design-round-3.md`
- reviewedRound3DesignSha256: `ff191fe9b0877b9fc613fb0f98341fa757a19019918f83b875d564d5e8a91b57`
- reviewedRoleCoverageMatrix: `docs/rules/ROLE_COVERAGE_MATRIX.md`
- reviewedRoleCoverageMatrixSha256: `c7961361455c4a2b05a725a8802d875664082c32aa9da27ef813c5d6ed012b44`
- implementationAuthorizedAtReview: `false`
- productionChangesAtReview: `0`
- testChangesAtReview: `0`
- workflowChangesAtReview: `0`
- dependencyChangesAtReview: `0`

The worktree contains only the authorized documentation/control paths. No PR, production edit, test edit, implementation commit, feature push, or tag exists. Base CI run `29553826536` is complete `SUCCESS` for exact HEAD `d5d007ff9b9b7140a3552d076a53330893a3201d`; it is baseline evidence only and does not pass a future feature HEAD.

## sourcesIndependentlyRead

The reviewer independently read the live fixed revisions rather than trusting the rule-researcher summary, tests, README files, or model memory:

- `docs/rules/USER_OVERRIDES.md`; no Dreamer/Vortox rule override exists.
- Chinese Wiki 筑梦师 oldid `3046`, live HTTP 200, raw SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`.
- Chinese Wiki 涡流 oldid `6198`, live HTTP 200, raw SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`.
- Chinese Wiki 数学家 oldid `6214`, live HTTP 200, raw SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`.
- Official Dreamer oldid `2904`, Official Vortox oldid `3017`, Official Mathematician oldid `3109`, Official States oldid `1039`, and Official Abilities oldid `1376`.
- Official nightsheet pinned commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, live SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

The external sources still support the frozen behavior: Dreamer yields one native GOOD and one native EVIL character; an effective living Vortox forces Townsfolk information false, including Dreamer, so neither displayed role equals the target's true character; the affected Dreamer player is one Mathematician abnormality caused by another character. Nightsheet positions independently reproduce Dreamer `61/80`, Vortox absent from first night, Vortox `47/99`, Dreamer `79/99`, and Mathematician `96/99` on other nights. No substantive rule conflict exists.

## productionAndTestMechanismsIndependentlyRead

Production files read directly:

- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/projections/src/index.ts`
- the existing event, rebuild, event-applier, opportunity, tenure, impairment, and accepted-store paths referenced by the design

Test/harness files read directly:

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream-fixture.ts`

There are no implemented 2B19A3A C27-C32 tests yet. Their exact planned mechanisms are therefore judged against the current callable seams and analogous accepted tests, not assumed from labels.

## mechanismFindings

### C27

- exact criterion: unresolved Vortox/source capability returns the exact dependency failure, no receipt, zero events, unchanged version, and OPEN opportunity.
- initial state: a legal accepted V3-open prefix is built first.
- mutation: a cloned `GameState`/provenance aggregate is manually made noncanonical so capability proof becomes unresolved.
- callable seam: the private application preflight/`createBatchOrReject`-style boundary is invoked directly rather than executing the full legal successful command-to-projection chain.
- final assertion: failure/rejection, not success.
- correct Reachability: `R3`.
- Round 3 PrimaryLayer: `STRUCTURAL_VALIDATION`.
- independent conclusion: incorrect. This is a semantic canonical-capability/provenance failure over a manually altered derived state. It is not a direct payload validator, ID parser, exact-shape validator, or field/cross-link validator under user section 3.3. The accepted prefix is supporting only.

### C28

- exact criterion: substituted-catalog candidate shortage returns the exact dependency failure, no receipt, zero events, unchanged version, and OPEN opportunity.
- initial state: a legal accepted V3-open prefix.
- mutation: the catalog/dependency is manually substituted so a legal candidate cannot be produced.
- callable seam: direct application dependency/preflight path.
- final assertion: failure/rejection.
- correct Reachability: `R3`.
- Round 3 PrimaryLayer: `STRUCTURAL_VALIDATION`.
- independent conclusion: incorrect. Candidate sufficiency is a semantic deterministic-policy/dependency condition, not direct shape/version/ID/field validation. The accepted prefix is supporting only.

### C29

- exact criterion: a prospective `DomainError` preserves the first-night-role-action failure stage and no-write contract.
- initial state: a legal accepted prefix.
- mutation: the private `createBatch` method is monkeypatched so the proposed, not-yet-accepted delivery/batch is malformed.
- callable seam: public command execution reaches `validateProspectiveBatch`; no persisted/imported history is replayed.
- final assertion: prospective rejection.
- correct Reachability: `R3`.
- Round 3 PrimaryLayer: `HOSTILE_REPLAY_REJECTION`.
- independent conclusion: incorrect. The current implementation validates and applies a proposed in-memory batch prospectively; it is not a replay/rebuild rejection of persisted or imported history under user section 3.2. The accepted prefix is supporting only.

### C30

- exact criterion: an unexpected non-`DomainError` during prospective validation preserves `prospective-validation`, no receipt, and zero events.
- initial state: a legal accepted prefix.
- mutation: private batch/payload/proxy fault injection causes an unexpected prospective exception.
- callable seam: public command execution followed by prospective validation; nothing has been accepted or replayed.
- final assertion: failure/rejection.
- correct Reachability: `R3`.
- Round 3 PrimaryLayer: `HOSTILE_REPLAY_REJECTION`.
- independent conclusion: incorrect for the same reason as C29: hostile prospective fault injection is not persisted/imported replay rejection.

### C31

- exact criterion: every injected batch/event-ID or clock failure preserves `MetadataGenerationFailed / event-metadata`, no receipt, zero events, and OPEN opportunity.
- initial state: a legal accepted prefix plus a real service/command.
- mutation: a fault-injecting metadata adapter throws before commit.
- final assertion: failure/rejection.
- correct Reachability: `R3` under the user's success-only R1 algorithm.
- Round 3 PrimaryLayer: `STRUCTURAL_VALIDATION`.
- independent conclusion: incorrect. The callable production path is metadata generation and exception mapping, not direct shape/version/ID/field validation.

### C32

- exact criterion: `failBeforeCommit` or `failDuringCommit` preserves `EventStoreAppendFailed / accepted-commit`, no receipt, zero accepted events, and OPEN opportunity.
- initial state: a legal accepted prefix plus a real service/command.
- mutation: the commit store is fault-injected; `GameApplicationService.execute` builds and prospectively validates the batch, then `commitAcceptedCommand` throws and maps the failure.
- final assertion: failure/rejection; there is no append, rebuild, or projection success.
- correct Reachability: `R3` under the user's success-only R1 algorithm.
- Round 3 PrimaryLayer: `STRUCTURAL_VALIDATION`.
- independent conclusion: incorrect. A commit-store outage/fault is neither a direct structural validator nor hostile persisted replay.

## classificationMatrixDiff

Round 2 to Round 3 changes are limited to classification/support authority:

| Row | Round 2 | Round 3 | Independent result |
|---|---|---|---|
| C27 | `R3/T1/ACCEPTED_STREAM_INTEGRATION` | `R3/T1/STRUCTURAL_VALIDATION` | still mislabeled; mechanism is outside section 3.3 |
| C28 | `R3/T1/ACCEPTED_STREAM_INTEGRATION` | `R3/T1/STRUCTURAL_VALIDATION` | still mislabeled; semantic candidate/dependency failure |
| C29 | `R3/T1/ACCEPTED_STREAM_INTEGRATION` | `R3/T1/HOSTILE_REPLAY_REJECTION` | still mislabeled; prospective batch rejection is not persisted replay |
| C30 | `R3/T1/ACCEPTED_STREAM_INTEGRATION` | `R3/T1/HOSTILE_REPLAY_REJECTION` | still mislabeled; prospective exception is not persisted replay |
| C31 | `R3/T1/ACCEPTED_STREAM_INTEGRATION` | `R3/T1/STRUCTURAL_VALIDATION` | still mislabeled; metadata fault mapping is not structural validation |
| C32 | `R3/T1/ACCEPTED_STREAM_INTEGRATION` | `R3/T1/STRUCTURAL_VALIDATION` | still mislabeled; commit failure is not structural validation |
| S37 | self-referential frozen-matrix audit | independent R1/success audit | direction is correct, but it does not reject the new layer overreach |

Mechanical audit confirms `92` rows, `92` unique IDs, `92` unique rule claims, exactly one R, one T, and one permitted token per row, and no remaining literal `R3 + ACCEPTED_STREAM_INTEGRATION` pair. That mechanical result is insufficient: primary layers must match their real mechanisms.

A full-table semantic audit found one additional unchanged misclassification. C17's main assertion is `ApplicationNotConfigured`, receipt-free, zero-event, OPEN-opportunity failure. Its prefix is genuinely R1-reachable, but it does not complete `command -> producer -> accepted events -> receipt -> append -> rebuild -> projection` and its main assertion is not legal success. Therefore C17 cannot retain `ACCEPTED_STREAM_INTEGRATION` under the user's Round 3 algorithm. This is still a classification-only defect; the frozen unsupported behavior itself remains correct.

The C27-C32 `supportingTests` cells also cite `packages/application/src/game-application-service.test.ts :: 2B19A3A-C01`, while the unique C01 primary row is `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C01`. The cited application C01 is neither a unique trace row nor an unambiguous named fixture. Thus accepted-prefix support is declared non-primary in prose but is not traceably identified without duplicating C01 or pointing to a nonexistent authority.

## behaviorDiffProof

A complete Round 2/Round 3 byte diff was read. Outside authority metadata, the new classification algorithm/mechanism descriptions, C27-C32/S37 trace rows, supporting-authority cells, evidence hash/responsibility record, documentation allowlist entries, completion-criterion numbering, and terminal, the behavior contracts are unchanged.

Specifically unchanged: effective base Dreamer only; effective current Vortox only; source impairment deferred to 2B19A3B; accepted-stream pre-delivery proof; positive-only V3 constraint; no negative absence evidence; no new ledger evidence; no new event type or `GameState` field; exact V3 payload; candidate policy; target/delivery/settlement atomicity; nine/ten evidence cardinality; `ABNORMAL / VORTOX_FALSE_INFORMATION`; Mathematician single-player consumption; source-only player/AI projection; V1/V2 compatibility; receipt/retry behavior; production/test allowlists; five expected production files; 700-950 estimated and <=1000 binding production LOC.

Therefore `behaviorDesignChanged=false`, `ruleSemanticsChanged=false`, `eventSchemaChanged=false`, `ledgerSchemaChanged=false`, `productionAllowlistChanged=false`, and no non-classification product architecture/provenance/schema/public-trust blocker was found.

## evidenceResponsibility

The updated evidence explicitly marks `requiredRegressionTests` as `NON_AUTHORITATIVE_ENGINEERING_TRACE_REFERENCE`, retains external rule/source authority, and delegates Reachability/Trust/PrimaryLayer/test authority to the Round 3 design and generated traceability. External source revisions, hashes, supported/unsupported rule boundary, source-impairment deferral, and `RULE_READY` remain unchanged. This satisfies the requested rule-evidence/engineering-traceability responsibility separation.

## twelveScopeChecks

1. C27 mechanism/classification: `FAIL` — R3 correct; STRUCTURAL incorrect.
2. C32 mechanism/classification: `FAIL` — R3 correct; STRUCTURAL incorrect.
3. Full table R3/accepted mislabel audit: `FAIL` semantically — literal R3/accepted pairs are gone, but C27-C32 were relabeled into layers their mechanisms do not exercise, and C17 still uses accepted integration for a failure-primary test.
4. Exactly one primary layer per row: `PASS` mechanically; `FAIL` substantively for C17/C27-C32.
5. Accepted prefix supporting only: `PARTIAL` — prose is correct, but the supporting C01 reference is ambiguous/nonexistent as a unique authority.
6. Rule evidence versus engineering traceability: `PASS`.
7. Behavior design completely unchanged: `PASS`; `behaviorDesignChanged=false`.
8. Source impairment remains 2B19A3B: `PASS`.
9. No negative evidence: `PASS`.
10. No new ledger evidence: `PASS`.
11. No new shared infrastructure: `PASS`.
12. Scope and scale remain 2B19A3A: `PASS` for product scope/scale; `FAIL` for required Round 3 authority metadata because the design's `authorization` field still names the original reslice authorization and omits the exact `correctionScope: REACHABILITY_AND_PRIMARY_TEST_LAYER_CLASSIFICATION_ONLY` field required by the user.

## findings

### BLOCKER 1 — C27-C32 primary layers do not match the real mechanisms

- severity: `BLOCKER`
- file/symbol: `docs/implementation/phase-3-slice-2b19a3a-design-round-3.md`, `classificationAuthorityRound3`, C27-C32, completion criteria 23-25
- failureScenario: Round 3 broadens `STRUCTURAL_VALIDATION` to application and commit boundaries beyond user section 3.3, and broadens `HOSTILE_REPLAY_REJECTION` to proposed-batch prospective faults beyond user section 3.2. A green implementation could therefore claim the correction passed while never executing the frozen primary layers.
- requiredCorrection: none may be inferred. With the seven frozen tokens, these failure-injection mechanisms do not honestly fit the labels selected. Do not change test behavior merely to retain a label and do not add a Round 4 without explicit user authority.
- requiredRegressionTests: any future authorized design must give each C27-C32 mechanism a primary authority whose implementation actually satisfies the named layer; accepted prefix remains supporting only.

### BLOCKER 2 — C17 remains failure-primary accepted-stream authority

- severity: `BLOCKER`
- file/symbol: `docs/implementation/phase-3-slice-2b19a3a-design-round-3.md`, C17 and S37
- failureScenario: C17 asserts an unsupported no-write failure, not the full successful application chain required by the user's R1/accepted-stream algorithm. S37 would still permit it because it only rejects accepted-layer rows whose R is not R1.
- requiredCorrection: no Round 4 is authorized. Preserve the R1-reachable unsupported behavior, but do not call its failure-primary test accepted-stream integration.
- requiredRegressionTests: a future authorized classification must separately record the real accepted prefix as supporting and the unsupported command failure under an honest primary layer.

### BLOCKER 3 — accepted-prefix supporting authority is not uniquely traceable

- severity: `BLOCKER`
- file/symbol: C27-C32 `supportingTests` cells
- failureScenario: the cited application-service C01 conflicts with the table's unique rebuild C01 and does not identify a real unique fixture/test authority. This either duplicates an authority ID or points to a nonexistent test.
- requiredCorrection: no Round 4 is authorized. A future authorized design must name the accepted-prefix builder/fixture or a distinct unique supporting authority without promoting it to primary.
- requiredRegressionTests: static trace audit must resolve every supporting reference to one existing unique test or named fixture and reject duplicate authority IDs.

### BLOCKER 4 — Round 3 authority metadata does not record the authorized correction

- severity: `BLOCKER`
- file/symbol: `Authority Metadata`
- failureScenario: `authorization` still reads `USER_AUTHORIZED_2B19A3_RESLICE_TO_ACCEPTED_STREAM_EFFECTIVE_VORTOX_ONLY`; the required classification-correction authorization and exact `correctionScope` field are absent. The prose cannot replace mandatory authority metadata.
- requiredCorrection: no Round 4 or silent byte change is authorized.
- requiredRegressionTests: future materialization integrity must assert exact authorization, design round, parent Round 2 hash, correction scope, unchanged-behavior flags, and terminal.

No new product behavior, BOTC rule, event/payload, provenance, ledger schema, shared infrastructure, or public trust-boundary blocker was found. The result is therefore a remaining classification/control defect, not an independently discovered product reslice blocker.

## verdict

- behaviorDesignChanged: `false`
- ruleSemanticsChanged: `false`
- implementationAuthorized: `false`
- verdict: `RULE_DESIGN_FIX_REQUIRED`
- remainingBlockers:
  - `C27_C32_PRIMARY_LAYER_MECHANISM_MISMATCH`
  - `C17_FAILURE_PRIMARY_ACCEPTED_STREAM_MISCLASSIFICATION`
  - `ACCEPTED_PREFIX_SUPPORTING_AUTHORITY_NOT_UNIQUELY_TRACEABLE`
  - `ROUND3_CORRECTION_AUTHORITY_METADATA_INCOMPLETE`
- downstreamControllerStatus: `HUMAN_BLOCKED`
- requiredNextAction: `STOP_NO_DESIGN_ROUND_4`

RULE_DESIGN_FIX_REQUIRED
