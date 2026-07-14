reviewedDesignPath: `docs/implementation/phase-3-slice-2b19-design-round-2.md`

reviewedDesignSha256: `b169a34d18334dd403a08fece16a7932a54a4259a724495c7e95fca7c29d0c00`

reviewTimestamp: `2026-07-14T10:03:12.9155305+08:00`

sourcesIndependentlyRead:

- Official Dreamer `oldid=2904`
- Official Vortox `oldid=3017`
- Official Philosopher `oldid=2421`
- Official States `oldid=1039`
- Official Abilities `oldid=1376`
- Chinese Wiki 筑梦师 `oldid=3046`
- Chinese Wiki 涡流 `oldid=6198`
- Chinese Wiki 哲学家 `oldid=5125`
- Official nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- Round 1 design and review
- Accepted 2B13, 2B17.2, 2B18A and 2B18B status documents

Independent nightsheet verification:

- SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- First night: Philosopher index `13`, Dreamer index `60`
- Other nights: Philosopher index `10`, Vortox index `46`, Dreamer index `78`

codeFilesRead:

- `packages/domain-core/src/ids.ts`
- `packages/domain-core/src/setup-types.ts`
- `packages/domain-core/src/player-roster.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

round1BlockerDisposition:

- `B1_EXACT_VALIDATION_INPUTS_UNDEFINED`: `PARTIALLY_CLOSED`. Public resolver, prospective and stored-validation inputs are now exact, but canonical state capture and fingerprint construction remain incomplete.
- `B2_CANONICAL_IMPAIRMENT_PATHS_UNREACHABLE_AS_CLAIMED`: `STILL_OPEN`. The impairment support matrix is corrected, but several tests still claim accepted-stream reachability for impossible or corrupted histories.
- `B3_V1_V2_BASE_OPPORTUNITY_DISCRIMINATION_UNDEFINED`: `CLOSED`.
- `B4_V2_LEDGER_EVIDENCE_ORDER_AND_IDENTITY_UNDEFINED`: `CLOSED`.
- `B5_VORTOX_MULTIPLICITY_AND_BASE_SETTLEMENT_VALIDITY_UNDEFINED`: `CLOSED`.
- Projection trust seam: `CLOSED`.
- Stable additional test IDs: `CLOSED`, subject to correcting their layers.

findings:

1. **BLOCKER — canonical context and pipeline fingerprint construction are not exact.**
   - `CanonicalDreamerV2Context` and `DreamerV2PipelineStateFingerprint` require non-optional choice, grant, insertion, opportunity, impairment, impairment-provenance, target-choice and delivery sets.
   - Corresponding `GameState` fields are optional. A normal base-Dreamer history can legitimately leave several of them absent.
   - Round 2 does not freeze whether absence becomes `{ choices: [] }`, `{ abilities: [] }`, `{ insertions: [] }`, `{ impairments: [] }`, `{ entries: [] }`, `{ deliveries: [] }`, or remains absent.
   - Existing Mathematician code explicitly freezes this normalization; the Dreamer design merely says fields are cloned canonical data.
   - `GameState.roster` is `PlayerRosterCreatedPayload`, while the contract requires `PlayerRoster`; the design does not freeze the `.entries` mapping.
   - `GameState.setup` and task-plan payloads contain rules-baseline metadata beyond the narrower fingerprint types; the design does not say whether these fields are retained or stripped.
   - The fingerprint calls itself full but omits `rulesBaselineVersion` and `firstNightInitializationProvenance`, both of which are required by the branded canonical context and affect event/provenance validation.
   - Consequently, two implementations can produce different fingerprints from the same valid state, or treat a pipeline state as matching while security-relevant canonical context differs.

2. **BLOCKER — accepted-stream reachability remains overstated.**
   - `D19-025` is classified as application accepted-stream testing of multiple gained Dreamer tasks. Current accepted history permits unique actual roles, one Philosopher, and one settled Philosopher choice; it cannot canonically produce multiple gained Dreamer tasks. This belongs at the scheduler/policy seam.
   - `D19-077` and `D19-078` classify missing Vortox tenure and conflicting current Vortox identities as application accepted-stream paths. Valid rebuild bootstraps role tenure and preserves unique role identity; these states require corrupted history and must be labeled hostile replay rejection or a pure constraint seam.
   - `D19-092` classifies base Dreamer role/seat/tenure discontinuity as application accepted-stream. No current canonical character-change producer can cause that transition for a base Dreamer or Philosopher source. It is a hostile continuity seam, not accepted-stream support.
   - These classifications conflict with the design’s own requirement that fabricated histories must not masquerade as canonical product support.

ruleCorrectness:

- `PASS`
- Normal Dreamer information, active-Vortox false-information semantics, impairment/Vortox precedence, native character-type classification, Philosopher-gained source identity, settlement-time target truth and immutable historical delivery are correct.
- No material conflict was found among the fixed external sources.
- `PARTIAL` remains the correct coverage status.

contractCompleteness: `FAIL — canonical capture, empty normalization, payload-to-domain mapping and fingerprint coverage remain undefined`

implementationSafety: `FAIL — the implementer would need to invent security-relevant canonicalization and fingerprint behavior`

testCoverage: `FIX_REQUIRED — D19-001–095 are enumerated, but D19-025, D19-077, D19-078 and D19-092 have incorrect execution-layer claims`

scopeCompliance:

- The functional scope remains bounded to 2B19.
- V1 behavior, Mathematician event contracts, other-night behavior, Traveller handling, general poisoning, death/alive infrastructure and Phase 2C remain out of scope.
- The incorrect accepted-stream claims must be removed; otherwise the design overstates implemented product coverage.

requiredFixes:

1. Freeze one exact canonical state-capture and fingerprint algorithm:
   - define every required-field rejection;
   - define exact empty-set normalization for every optional collection;
   - define roster, setup and task-plan payload mappings;
   - use identical normalization for pipeline and accepted-stream rebuilds;
   - include `rulesBaselineVersion` and `firstNightInitializationProvenance` in the fingerprint, or provide an exact alternative that proves those context fields cannot differ.
2. Correct test layering:
   - move `D19-025` to the scheduler/policy seam;
   - move `D19-077` and `D19-078` to hostile replay rejection or the Vortox constraint seam;
   - move `D19-092` to a hostile source-continuity seam;
   - state the exact expected rejection and prohibit fabricated histories from being described as accepted streams.

remainingBlockers:

- `B1_CANONICAL_CAPTURE_NORMALIZATION_AND_FINGERPRINT_UNDEFINED`
- `B2_ACCEPTED_STREAM_REACHABILITY_LAYERING_STILL_INCORRECT`

verdict: `RULE_DESIGN_FIX_REQUIRED`

RULE_DESIGN_FIX_REQUIRED
