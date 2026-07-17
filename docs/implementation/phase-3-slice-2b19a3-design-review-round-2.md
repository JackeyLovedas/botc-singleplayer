# Phase 3 Slice 2B19A3 — Independent Rule Design Review Round 2

## Review identity

- reviewedDesign: `docs/implementation/phase-3-slice-2b19a3-design-round-2.md`
- reviewedDesignSha256: `c0bffc0f420bc769341a08ec9d42f7c178f6a6078797e0725aa5ba8e22013cae`
- reviewedEvidence: `docs/rules/evidence/2B19A3.md`
- reviewedEvidenceSha256: `798c5d2edeb7053e9cd720937e15785492ce214b87f7975f9a66cc9b056947c6`
- reviewedGovernance: `docs/architecture/2B19A3-go-no-go-under-governance-v1.md`
- reviewedGovernanceSha256: `2950b08811e97eddb9b6457ce1a453297df3bd55787c7df0007618e3e80a0402`
- parentRound1DesignSha256: `da48346689c049c1e247d81f0f36e68efc0967e37db5688cc2e3a9ae729f5e3e`
- parentRound1ReviewSha256: `024d6bea20055f7e4f21472509e6f53251c1df1286bba719b5cb580f721339e6`
- reviewedRepositoryHead: `138748d8211b961616f414d6bf17911fd93f4265`
- reviewedBranch: `phase-3/dreamer-v2-base-vortox-information`
- reviewTimestamp: `2026-07-17T11:31:06.3145157+08:00`
- implementationState: no production or test modifications; `ruleDesignPass=false` and `implementationAuthorized=false`.

The reviewed design contains all `C01–C53` and `S01–S13` identifiers exactly once and ends with `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`.

## Sources independently checked

Pinned source bytes were independently retrieved and checked rather than relying on the evidence summary.

| Source | Revision | SHA-256 / result |
|---|---:|---|
| `docs/rules/USER_OVERRIDES.md` | accepted bytes | `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`; no Dreamer/Vortox override |
| Chinese Wiki 首页 | `oldid=5855` | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` |
| Chinese Dreamer | `oldid=3046` | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |
| Chinese Vortox | `oldid=6198` | `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff` |
| Chinese Mathematician | `oldid=6214` | `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e` |
| Official Dreamer | `oldid=2904` | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Official Vortox | `oldid=3017` | `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07` |
| Official States | `oldid=1039` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Abilities | `oldid=1376` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| Official Mathematician | `oldid=3109` | `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b` |
| Official nightsheet | commit `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

Independent nightsheet parsing confirms:

- first night: 80 entries; Clockmaker 60, Dreamer 61, Seamstress 62, Mathematician 77; Vortox absent;
- other night: 99 entries; Vortox 47, Dreamer 79, Mathematician 96.

No substantive external rule conflict exists. The sources support:

- Dreamer reports one GOOD and one EVIL character.
- Under an effective Vortox, neither Dreamer role may equal the target’s true character.
- Vortox false information still applies when the Dreamer is drunk or poisoned.
- A drunk or poisoned Vortox has no effective Vortox ability.
- Vortox-caused false Dreamer information qualifies as abnormal behavior caused by another character for Mathematician.
- The four Mathematician simulator policies remain user-approved product contracts, not official-rule claims.

## Repository material inspected

The review independently covered:

- `AGENTS.md` and the ordered project handoff chain;
- `docs/agent-loop/AUTOPILOT_PROMPT.md`;
- `docs/agent-loop/REVIEW_PROTOCOL.md`;
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`;
- the 2B19A3 governance, refreshed evidence, both design rounds, Round 1 review, control state, role coverage matrix, and relevant 2B19T/A1/A2 authorities;
- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/domain-batch-semantics.ts`;
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`;
- `packages/domain-core/src/philosopher-ability.ts`;
- relevant event, state, rebuild, and applier contracts;
- `packages/application/src/game-application-service.ts`;
- `packages/projections/src/index.ts`;
- the proposed and existing Dreamer, ledger, application, replay, and projection tests.

## Round 1 blocker disposition

1. Fresh Mathematician evidence: **closed**.
2. Honest R1/R4 test classification: **partially closed; blocker remains**.
3. Exact constructor/stored-validator/preparation/equality contracts: **partially closed; stored-validator provenance contradiction remains**.
4. Failure and receipt matrix: **closed at design-text level**.
5. Exact ledger cardinality and identity: **partially closed; required identities exceed the unchanged evidence schema**.
6. Allowlist and LOC constraints: **closed**.

## Findings

### 1. BLOCKER — P1 — Stored V3 validation cannot prove the historical facts it is required to prove

- file/symbol:
  - `docs/implementation/phase-3-slice-2b19a3-design-round-2.md:288-315`
  - `validateStoredDreamerInformationDelivered`
  - projection contract at lines 389 and 393
  - ledger omission rule at lines 381 and 564
- failure scenario:
  - The exact public signature adds only `firstNightAbilityOutcomeLedger?: FirstNightAbilityOutcomeLedger`.
  - It does not receive role-tenure state, the impairment aggregate, current/historical character state, accepted event envelopes, or another accepted-history provenance object.
  - Nevertheless, step 6 requires the validator to independently re-prove source and Vortox tenure, source impairment, candidate truth, and absence of applicable Vortox impairment from canonical historical facts.
  - The design expressly says omission of Vortox impairment evidence is not proof of effectiveness and requires re-evaluation of the complete canonical impairment aggregate.
  - That aggregate is unavailable through the frozen signature. The ledger under validation cannot independently prove its own missing impairment record; doing so would reduce persisted-history validation to shape and self-asserted provenance.
  - A shape-valid forged standalone `GameState` passed to private projection can therefore carry a forged V3 ledger while lacking the canonical tenure/impairment history that the design claims to validate.
- required correction:
  - Freeze a non-circular accepted-history proof source available to stored validation, such as a narrowly typed canonical historical context containing the exact tenure and impairment aggregates, or an accepted-stream-only projection entry that validates the complete reconstructed state before exposing the stored delivery.
  - Specify exact V1/V2 compatibility and V3-only requirements.
  - Do not treat ledger evidence or absence of evidence as independent proof of canonical impairment absence.
  - If this requires another public boundary, `GameState` field, evidence kind, or production file, invoke the design’s stop/reslice condition.
- required regression tests:
  - A shape-valid V3 payload and shape-valid ledger with an omitted canonical Vortox impairment must reject.
  - Forged standalone state must not project V3 knowledge.
  - Missing, duplicate, stale, conflicting, or cross-linked tenure/impairment aggregates must reject.
  - A genuine accepted V3 stream must still project the historical pair after later state changes.
  - V1/V2 stored callers must remain source-compatible.

### 2. BLOCKER — P1 — The exact ledger claims require identities absent from the unchanged evidence schema

- file/symbol:
  - design lines 368-381 and supporting authority `S02`
  - `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
  - `SourceEventEvidence`, `ActionOpportunityEvidence`, and `AbilityImpairmentEvidence`
- failure scenario:
  - The design freezes `SOURCE_EVENT` as bound to event ID, type, sequence, command, batch, and batch index.
  - The actual closed `SourceEventEvidence` shape contains only `eventId`, `eventType`, `eventSequence`, and `batchId`; it has neither `commandId` nor `batchIndex`.
  - The design says `ACTION_OPPORTUNITY` binds the exact V3 source contract, while the actual evidence variant has no source-contract, tenure-ID, or ability-instance fields.
  - It says source impairment binds the exact source tenure, but `AbilityImpairmentEvidence` contains no tenure ID.
  - Stored validation receives no delivery event envelope, so it cannot recover command or batch-index metadata outside the ledger.
  - Adding these fields to the persisted exact evidence variants would change existing V1/V2 evidence shapes and replay meaning, contrary to the frozen compatibility rule and the statement that the existing closed evidence vocabulary/schema remains unchanged.
- required correction:
  - Freeze only identities representable by the unchanged evidence schema and separately prove envelope metadata at replay/prospective boundaries; or introduce a separately versioned evidence contract with explicit migration/compatibility review.
  - State exactly where command ID and batch index are validated.
  - State which existing fact-level and evidence-level fields bind source ability instance, source tenure, and impairment tenure without claiming nonexistent fields.
  - Preserve exact V1/V2 historical shapes.
- required regression tests:
  - Exact command and batch-index mutations at the event-envelope boundary.
  - Exact evidence-key tests proving no silent widening of legacy variants.
  - V1/V2 ledger replay fixtures remain byte/shape compatible.
  - V3 source tenure, ability instance, Vortox tenure, and impairment identity mutations each reject at the boundary that actually owns those facts.
  - Stored validation must reject claims it cannot link to accepted envelope provenance.

### 3. BLOCKER — P1 — Reachability and primary-test classifications still contradict governance

- file/symbol:
  - design authority rows `C10`, `C24`, and `C46`
  - `docs/rules/evidence/2B19A3.md` required-regression rows 10, 16, 17, 20, 22, and 24
  - governance ADR reachability decision order and 2B19A3 R3/R4 lists
- failure scenario:
  - `C10` labels candidate shortage `R4→R1 / application failure`. The governance precheck explicitly classifies candidate shortage among hostile/impossible R3 cases. An accepted `SetupGenerated` catalog contains the required role populations, so a shortage needs malformed or manually substituted catalog state and cannot become an accepted-stream R1 path.
  - `C24` labels post-delivery target change as `R1 / projection`, but no accepted producer can change that target after first-night Dreamer delivery within the supported schedule. This is a pure historical-stability seam or future R4 path, not accepted-stream integration.
  - `C46` similarly describes an applicability/provenance conflict as `R4→R1 / application failure`; corrupted provenance is R3. Fault injection may verify failure mapping but cannot convert malformed provenance into an accepted-stream path.
  - The refreshed evidence requires only `ACCEPTED_STREAM_INTEGRATION` for canonically drunk/poisoned Vortox, source-poisoned Dreamer, and ineffective Vortox plus impaired source. The Round 2 design correctly says these have no accepted producer and assigns pure seams, so its test plan no longer conforms to the evidence’s allowed-primary-layer table.
  - The governance ADR requires each behavior/test to name exactly one primary reachability class. `R4→R1` is not a valid primary class for an invalid/corrupted path.
- required correction:
  - Classify candidate shortage and malformed applicability/provenance as R3 with hostile/boundary authority.
  - Classify post-delivery character change as R4/T3 pure policy unless a current accepted producer is identified.
  - Refresh the evidence test-layer table so represented poisoned-source and impaired-Vortox cases permit `PURE_POLICY_SEAM`, or provide a separately authorized accepted producer.
  - Do not label manually constructed state or fault injection as accepted-stream integration.
  - Keep only the actual effective-Vortox successful command path, and the genuinely reachable Philosopher-produced drunk-Dreamer path if proven, as R4-to-R1 Slice transitions.
- required regression tests:
  - Candidate shortage through a pure policy/hostile fixture with no R1 claim.
  - Malformed applicability/provenance through R3 boundary or injected-dependency tests with exact no-receipt/no-append assertions.
  - Post-delivery historical stability through a pure seam or valid R2 history.
  - Explicit traceability showing one primary reachability and one primary test layer for every criterion.
  - No application fixture may manually assemble state and call itself accepted-stream integration.

## Non-blocking assessments

- The Dreamer/Vortox rule interpretation, impairment precedence, forced-false proposition, Mathematician interaction, and official night order are correct.
- Fresh Mathematician evidence closes the previous source blocker.
- The V3 payload, constructor, typed clone/equality branches, deterministic candidate ordering, and three-event atomic batch are otherwise sufficiently frozen.
- The expanded failure/receipt table covers deterministic rejection, dependency, prospective validation, metadata, append, recovery, and actor-safe failure semantics.
- The exact 10/11 evidence cardinality arithmetic is internally consistent; the blocker is the mismatch between claimed identity bindings and the unchanged evidence fields.
- V1/V2 additive compatibility, source-private projection shape, no-leakage boundary, and historical-knowledge stability remain appropriate.
- The five-production-file allowlist and production LOC ceiling are correct.
- `PARTIAL / VORTOX_FORCED_FALSE_ONLY` remains the maximum valid Slice status; Dreamer and Mathematician remain `PARTIAL`, and Vortox remains `NOT_STARTED`.

## Rule assessment

External rule truth passes: there is no unresolved source conflict, the forced-false Dreamer semantics are correct, impairment precedence is correct, and the night-order claims match the pinned official nightsheet.

The design still fails the rule-design gate because persisted V3 rule claims cannot be independently proven through the frozen stored-validation and evidence contracts, and several claimed authority layers remain unreachable or misclassified.

## Architecture assessment

The bounded V3 producer is compatible with the event-sourced architecture in principle. Implementation is not authorized because the frozen design simultaneously requires complete historical provenance validation, with no omission-as-proof, while withholding the canonical tenure/impairment and envelope facts needed to perform it. Its exact ledger claims also exceed the fields available in the unchanged persisted evidence variants.

## remainingBlockers

1. Provide a non-circular, exact historical provenance source for stored V3 validation, including complete Vortox impairment absence.
2. Reconcile command/index/source-contract/tenure claims with the unchanged closed evidence schema and V1/V2 compatibility.
3. Correct R1/R3/R4 and primary-test-layer classifications, including the stale evidence authority table.

RULE_DESIGN_FIX_REQUIRED
