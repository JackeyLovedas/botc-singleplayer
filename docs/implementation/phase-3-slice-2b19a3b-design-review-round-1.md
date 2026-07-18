reviewedHead: `7287058da64cde1269aa01f0ef42ba2d14489a2c`

reviewedDesign:
- path: `docs/implementation/phase-3-slice-2b19a3b-design.md`
- sha256: `4937f3dbc741c638d7715502e64a79d603c78b2500dec06ca928cb638c00ce4b`
- reviewType: `INDEPENDENT_READ_ONLY_DESIGN_REVIEW`
- reviewTimestamp: `2026-07-18T16:04:25.8846689+08:00`

externalSourcesAndRevisions:
- `docs/rules/USER_OVERRIDES.md`: SHA-256 `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c`
- Chinese Dreamer: oldid `3046`, SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
- Chinese Philosopher: oldid `5125`, SHA-256 `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`
- Chinese Vortox: oldid `6198`, SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`
- Chinese Drunk: oldid `5720`, SHA-256 `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e`
- Chinese Poisoned: oldid `6294`, SHA-256 `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0`
- Chinese Mathematician: oldid `6214`, SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Official Dreamer: oldid `2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
- Official Philosopher: oldid `2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
- Official Vortox: oldid `3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Mathematician: oldid `3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official States: oldid `1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
- Official Abilities: oldid `1376`, SHA-256 `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`
- Official nightsheet repository commit: `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- Official nightsheet file-change commit: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- Official nightsheet SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- First-night positions, zero-based: Philosopher `13`, Dreamer `60`, Mathematician `76`; Vortox absent.
- Other-night positions, zero-based: Philosopher `10`, Vortox `46`, Dreamer `78`, Mathematician `95`.
- Live sources were independently retrieved and matched the evidence revisions and hashes. No external rules conflict was found.

filesReviewed:
- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- all handoff documents required by its reading order
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19A3B.md`
- `docs/rules/evidence/2B19A3B-resolved.md`
- original and resolved 2B19A3B governance prechecks
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b19a3b-design.md`
- accepted 2B19A3A design, release-review, implementation-status and PR #36 final-review archives
- test-ownership, application-sharding and process-isolation architecture/status documents
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- directly affected Dreamer, Philosopher, ledger, application, projection and replay tests
- `vitest.workspace.ts`
- `scripts/verify-vitest-coverage-groups.mjs`
- coverage-obligation and CI-profile verification scripts
- relevant `.github/workflows/ci.yml` paths

findings:

1. severity: `BLOCKER`
   id: `A3B_TEST_OWNERSHIP_VERIFIER_PREREQUISITE`
   file/symbol: `scripts/verify-vitest-coverage-groups.mjs`; design sections `testOwnership`, `coverageProfile`, file allowlists
   failureScenario: The verifier is frozen to marker `[2B19A3A-`, the A3A traceability document, A3A semantic hashes and a hash of every non-A3A application test. New `[2B19A3B-*]` tests are classified as non-marker tests, change the frozen non-marker hash and fail CI. The design requires unique ownership under `application-service-dreamer-vortox`, but neither its product/test allowlists nor its profile-commit allowlist permits the verifier change needed to establish that ownership.
   requiredCorrection: Create the separately governed CI-infrastructure prerequisite required by the accepted ADR, extending semantic ownership verification to a versioned 2B19A3B marker and traceability source without altering the A3A baseline or shard topology. Rebase and redesign 2B19A3B against that accepted prerequisite. Do not smuggle the shared verifier change into this product Slice.
   requiredRegressionTests:
   - 2B19A3B tests have exactly one semantic owner.
   - A3A markers, hashes and ownership remain unchanged.
   - Missing, duplicate and wrongly assigned 2B19A3B tests fail verification.
   - Dynamic application inventory reports zero missing and zero duplicate ownership.
   - Exact CI profile runs the updated verifier.

2. severity: `BLOCKER`
   id: `C07_DIRECT_STRUCTURAL_REACHABILITY_MISCLASSIFIED`
   file/symbol: `docs/implementation/phase-3-slice-2b19a3b-design.md`, criterion `C07`
   failureScenario: C07 declares a direct exact-shape-validator mechanism while assigning `R1`. Both the governance ADR and the design’s own mapping classify direct structural validation as `R3 + T1 + STRUCTURAL_VALIDATION`. The current claim cannot produce an honest MechanismMatch.
   requiredCorrection: Change C07’s expected reachability to exactly `R3`; retain one exact trust class and one primary layer.
   requiredRegressionTests:
   - C07 is exercised through the named direct validator.
   - Accepted-stream coverage remains separately owned by an R1 criterion.
   - Hostile replay support is not relabelled as the primary structural mechanism.

3. severity: `BLOCKER`
   id: `C34_COMPOUND_REACHABILITY_TRUST_CLASSIFICATION`
   file/symbol: design criterion `C34`
   failureScenario: C34 uses `R3 or R4 per case` and `T2/T3`. Governance V1.1 requires exactly one Reachability, one Trust class and one PrimaryLayer per criterion. The compound criterion cannot be audited deterministically.
   requiredCorrection: Split C34 into separate criteria for the R3 hostile/replay mechanism and R4 pure-seam mechanism. Each must name one physical test identity and exactly one reachability, trust class and primary layer.
   requiredRegressionTests:
   - Each replacement criterion resolves to one mechanism.
   - No test identity is used as the primary evidence for both criteria.
   - The generated traceability check rejects compound reachability or trust values.

4. severity: `BLOCKER`
   id: `S01_S17_UNMATERIALIZED_AND_MIXED_TRACEABILITY`
   file/symbol: design matrix `S01`–`S17`; criterion `C32`
   failureScenario: S01–S17 provide only IDs and assertions, not the nine mandatory design-time governance fields. The blanket structural classification is also false for S16 and S17: clone/reference independence, cross-version equality and fieldwise comparison are T3 pure-policy behavior, not T1 structural validation. Some hostile-shape rows additionally require replay support that cannot share a single ambiguous primary classification.
   requiredCorrection: Materialize all nine required fields for every S01–S17 row. Separate S01–S15 structural validation from S16–S17 pure-policy seams, and explicitly distinguish any hostile-replay supporting coverage. Assign exactly one physical identity and one primary layer per row.
   requiredRegressionTests:
   - Governance verifier rejects missing fields.
   - S16/S17 execute through a named pure seam and use fieldwise equality without JSON serialization.
   - Structural rows prove zero getter invocation and fail-closed behavior.
   - Hostile replay rows prove rejection before state mutation or receipt creation.

5. severity: `BLOCKER`
   id: `C15_C16_HOSTILE_REPLAY_TRUST_MISMATCH`
   file/symbol: design criteria `C15`, `C16`
   failureScenario: Both mechanisms describe accepted-prefix histories extended with duplicate or conflicting hostile markers and replay rejection, but assign T2. Persisted hostile history is T1 input. This understates the trust boundary and breaks the governance mapping.
   requiredCorrection: Classify the named hostile-replay mechanisms as T1, or redesign them as genuine T2 capability-seam tests with separate T1 replay criteria. Do not use one identity for both.
   requiredRegressionTests:
   - Duplicate impairment history fails closed.
   - Conflicting impairment history fails closed.
   - No receipt, ledger mutation or projection output is produced.
   - Each test’s trust classification matches its actual input origin.

6. severity: `BLOCKER`
   id: `C39_HISTORICAL_MUTATION_AUTHORITY_UNDEFINED`
   file/symbol: design criterion `C39`
   failureScenario: C39 claims `R2/T2/PROJECTION` for a “later canonical-state change” but does not identify an accepted canonical producer. General character-change producers are explicitly out of scope. A manually altered state or stream is R3, not R2, while an accepted-history claim must name its actual producer and authority.
   requiredCorrection: Freeze one concrete permitted mechanism. Either name an existing accepted later-state producer and classify the resulting historical projection test honestly, or make this a non-mutating/manual-state R3 seam. Do not imply accepted-history provenance from an ad hoc mutation.
   requiredRegressionTests:
   - Delivered V4 knowledge remains stable after the named later-state mechanism.
   - The test proves the stored historical fact is projected without recomputing target truth.
   - The mechanism’s actual reachability and trust class match the design entry.

gateChecks:
1. narrow simulator audit attribution override: `PASS`
2. external Dreamer/Philosopher/Vortox/Drunk/Mathematician semantics preserved: `PASS`
3. canonical Philosopher-produced DRUNK evidence has an R1 producer: `PASS`
4. POISONED base-Dreamer path remains R4/out of scope: `PASS`
5. accepted V1/V2/V3 meanings remain unchanged: `PASS`
6. proposed V4 payload is closed and field counts are internally coherent: `PASS`
7. exactly one terminal fact with Vortox as primary attribution: `PASS`
8. exact positive `ABILITY_IMPAIRMENT` evidence remains mandatory: `PASS`
9. Mathematician counts the Dreamer player at most once: `PASS`
10. no multi-cause array, graph, second cause or second terminal fact introduced: `PASS`
11. no new evidence variant, event type, GameState field or public resolver required: `PASS`
12. prospective/pre-event proof can be implemented without circular validation: `PASS`
13. player/AI/non-source projections can remain free of impairment, Vortox, target-truth and cause leakage: `PASS`
14. claimed test ownership and exact CI execution are implementable under frozen allowlists: `FAIL`
15. the Slice remains self-contained without unidentified shared infrastructure or stop-loss breach: `FAIL`

implementationFeasibility:
- The V4 runtime contract, capability precedence, replay derivation, atomic settlement, ledger cardinality and projection concealment are technically feasible in the named production surfaces.
- Proposed ledger evidence counts are coherent: V4 contains ten evidence items when the target is Vortox and eleven otherwise; accepted V3 counts remain nine or ten.
- Canonical Philosopher DRUNK production exists and precedes Dreamer settlement.
- The proposed Vortox proof can be derived from pre-event accepted history without circular reliance on the event being validated.
- Production scope and approximate LOC remain plausible.
- Implementation is not currently admissible because exact test ownership and CI provenance cannot be achieved under the frozen design and repository baseline.
- The C/S traceability contract is additionally non-materializable until the reachability, trust and primary-layer defects above are corrected.

remainingBlockers:
- `A3B_TEST_OWNERSHIP_VERIFIER_PREREQUISITE`
- `C07_DIRECT_STRUCTURAL_REACHABILITY_MISCLASSIFIED`
- `C34_COMPOUND_REACHABILITY_TRUST_CLASSIFICATION`
- `S01_S17_UNMATERIALIZED_AND_MIXED_TRACEABILITY`
- `C15_C16_HOSTILE_REPLAY_TRUST_MISMATCH`
- `C39_HISTORICAL_MUTATION_AUTHORITY_UNDEFINED`

RULE_DESIGN_FIX_REQUIRED
